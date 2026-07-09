import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import expenseService from '../services/expenseService';
import DynamicTable from '../components/DynamicTable';
import KpiCard from '../components/KpiCard';
import Loading from '../components/loading';
import { formatCurrency } from '../utils/currency';

const EXPENSE_CATEGORIES = [
  'Rent', 'Utilities', 'Salaries', 'Marketing', 'Supplies', 'Insurance', 'Maintenance', 'Other',
];

const emptyForm = {
  category: 'Rent',
  description: '',
  amount: '',
  expense_date: dayjs(),
};

function ExpensePage({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getExpenseList(user);
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const totalThisMonth = useMemo(() => {
    const now = dayjs();
    return expenses
      .filter((e) => dayjs(e.expense_date).isSame(now, 'month'))
      .reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [expenses]);

  const totalAllTime = useMemo(
    () => expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    [expenses]
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (row) => {
    setEditingId(row.id);
    setForm({
      category: row.category,
      description: row.description || '',
      amount: String(row.amount),
      expense_date: dayjs(row.expense_date),
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSave = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        category: form.category,
        description: form.description,
        amount: Number(form.amount),
        expense_date: form.expense_date.format('YYYY-MM-DD'),
        user_id: user.id,
      };

      if (editingId) {
        await expenseService.updateExpense(editingId, payload, user);
      } else {
        await expenseService.addExpense(payload);
      }
      setDialogOpen(false);
      await fetchExpenses();
    } catch (err) {
      console.error(err);
      alert('Failed to save expense. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    const confirmed = window.confirm(`Delete this ${row.category} expense of ${formatCurrency(row.amount)}?`);
    if (!confirmed) return;
    try {
      await expenseService.deleteExpense(row.id, user);
      await fetchExpenses();
    } catch (err) {
      console.error(err);
      alert('Failed to delete expense. Please try again.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Expenses</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ backgroundColor: '#6f42c1', '&:hover': { backgroundColor: '#5a34a8' } }}
        >
          Add Expense
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 260px' }}>
          <KpiCard title="Expenses This Month" value={formatCurrency(totalThisMonth)} color="#c62828" />
        </Box>
        <Box sx={{ flex: '1 1 260px' }}>
          <KpiCard title="Total Expenses (All Time)" value={formatCurrency(totalAllTime)} color="#546e7a" />
        </Box>
      </Box>

      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <DynamicTable
            columns={[
              { field: 'date', label: 'Date' },
              { field: 'category', label: 'Category' },
              { field: 'description', label: 'Description' },
              { field: 'amount', label: 'Amount (Rp)' },
            ]}
            rows={expenses.map((e) => ({
              id: e.id,
              date: dayjs(e.expense_date).format('DD MMM YYYY'),
              category: e.category,
              description: e.description || '-',
              amount: formatCurrency(e.amount),
              _raw: e,
            }))}
            actions={(row) => (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={() => handleOpenEdit(row._raw)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(row._raw)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          />
          {expenses.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No expenses recorded yet. Click "Add Expense" to get started.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  label="Category"
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount (Rp)"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={form.expense_date}
                  onChange={(newDate) => setForm({ ...form, expense_date: newDate })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                multiline
                minRows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{ backgroundColor: '#6f42c1', '&:hover': { backgroundColor: '#5a34a8' } }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ExpensePage;
