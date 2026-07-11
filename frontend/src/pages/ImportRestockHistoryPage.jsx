import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Chip,
    Alert,
    LinearProgress,
    Stack,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import productService from '../services/productService';
import supplierService from '../services/supplierService';
import orderService from '../services/orderService';

const PRIMARY_COLOR = '#6f42c1';
const STEPS = ['Upload file', 'Map columns', 'Review & import'];

// Historical restocks are recorded as already-completed orders (status "Done", same as
// when a real order is marked fully received in OrderDetailPage) but are inserted
// directly rather than going through that page's "mark received" action - which is the
// only place stock actually gets incremented. So this deliberately never touches
// products.stock: the product's current stock already reflects real-world reality,
// this is purely a historical record for reporting.
const FIELDS = [
    { key: 'product_id', label: 'Product ID', required: true },
    { key: 'quantity', label: 'Quantity Received', required: true },
    { key: 'unit_price', label: 'Unit Price', required: true },
    { key: 'date', label: 'Restock Date', required: true },
    { key: 'supplier', label: 'Supplier', required: false },
    { key: 'notes', label: 'Notes', required: false },
];

const toText = (v) => (v === null || v === undefined ? '' : String(v).trim());
const toNumber = (v) => {
    const n = Number(String(v ?? '').replace(/,/g, '').trim());
    return Number.isFinite(n) ? n : NaN;
};

// Excel serial dates use 1899-12-30 as day 0 (accounting for Lotus 1-2-3's 1900 leap-year
// bug, which Excel preserved for compatibility). exceljs already returns a real Date
// object for cells formatted as dates, so this only kicks in for plain numeric/text cells.
const EXCEL_EPOCH_MS = Date.UTC(1899, 11, 30);
const parseDate = (v) => {
    if (v instanceof Date && !isNaN(v.getTime())) return v;
    if (typeof v === 'number' && Number.isFinite(v)) {
        return new Date(EXCEL_EPOCH_MS + v * 86400000);
    }
    if (typeof v === 'string' && v.trim()) {
        const d = new Date(v.trim());
        if (!isNaN(d.getTime())) return d;
    }
    return null;
};

function ImportRestockHistoryPage({ user }) {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState(null);

    const [fileName, setFileName] = useState('');
    const [headers, setHeaders] = useState([]);
    const [rawRows, setRawRows] = useState([]);
    const [mapping, setMapping] = useState({});

    const [previewRows, setPreviewRows] = useState([]);
    const [preparingPreview, setPreparingPreview] = useState(false);

    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [importResults, setImportResults] = useState(null);

    const handleBackClick = () => navigate(-1);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setError(null);

        try {
            const buffer = await file.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            const worksheet = workbook.worksheets[0];
            if (!worksheet) throw new Error('No sheet found in this file.');

            const rows = [];
            worksheet.eachRow((row) => {
                rows.push(row.values.slice(1).map((v) => (v && v.text ? v.text : v)));
            });

            if (rows.length < 2) {
                throw new Error('This file needs a header row plus at least one data row.');
            }

            const detectedHeaders = rows[0].map((h, i) => toText(h) || `Column ${i + 1}`);
            const dataRows = rows.slice(1).filter((r) => r.some((cell) => toText(cell) !== ''));

            setFileName(file.name);
            setHeaders(detectedHeaders);
            setRawRows(dataRows);

            const autoMapping = {};
            FIELDS.forEach((f) => {
                const idx = detectedHeaders.findIndex((h) => {
                    const normalized = h.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return (
                        normalized === f.key.replace(/_/g, '') ||
                        normalized === f.label.toLowerCase().replace(/[^a-z0-9]/g, '')
                    );
                });
                if (idx !== -1) autoMapping[f.key] = idx;
            });
            setMapping(autoMapping);
            setActiveStep(1);
        } catch (err) {
            console.error('Failed to parse file:', err);
            setError(err.message || 'Failed to read this file. Please make sure it is a valid .xlsx or .xls file.');
        } finally {
            e.target.value = '';
        }
    };

    const handleMappingChange = (fieldKey, columnIndex) => {
        setMapping((prev) => ({ ...prev, [fieldKey]: columnIndex === '' ? undefined : columnIndex }));
    };

    const canProceedFromMapping = FIELDS.filter((f) => f.required).every((f) => mapping[f.key] !== undefined);

    const handleBuildPreview = async () => {
        setPreparingPreview(true);
        setError(null);
        try {
            const existingProducts = await productService.getProductList(user.id);
            const existingIds = new Set((existingProducts || []).map((p) => String(p.id)));

            const rows = rawRows.map((raw, i) => {
                const get = (key) => (mapping[key] !== undefined ? raw[mapping[key]] : undefined);

                const productId = toText(get('product_id'));
                const quantity = toNumber(get('quantity'));
                const unitPrice = toNumber(get('unit_price'));
                const date = parseDate(get('date'));
                const supplier = toText(get('supplier'));
                const notes = toText(get('notes'));

                let status = 'ok';
                let reason = '';

                if (!productId) { status = 'error'; reason = 'Missing Product ID'; }
                else if (!existingIds.has(productId)) { status = 'error'; reason = 'Product ID not found in your inventory'; }
                else if (!Number.isFinite(quantity) || quantity <= 0) { status = 'error'; reason = 'Invalid Quantity'; }
                else if (!Number.isFinite(unitPrice) || unitPrice < 0) { status = 'error'; reason = 'Invalid Unit Price'; }
                else if (!date) { status = 'error'; reason = 'Invalid or missing Date'; }
                else if (date > new Date()) { status = 'error'; reason = 'Date is in the future'; }

                return {
                    row: i + 2,
                    product_id: productId, quantity, unit_price: unitPrice, date,
                    supplier: supplier || null, notes: notes || '',
                    status, reason,
                };
            });

            setPreviewRows(rows);
            setActiveStep(2);
        } catch (err) {
            console.error('Failed to prepare preview:', err);
            setError('Failed to check existing inventory. Please try again.');
        } finally {
            setPreparingPreview(false);
        }
    };

    const handleImport = async () => {
        setImporting(true);
        setImportProgress(0);
        setError(null);

        const toImport = previewRows.filter((r) => r.status === 'ok');
        const supplierCache = {};
        let imported = 0;
        let failed = 0;
        const failures = [];

        for (let i = 0; i < toImport.length; i++) {
            const row = toImport[i];
            try {
                let supplierId = null;
                if (row.supplier) {
                    const key = row.supplier.toLowerCase();
                    if (!(key in supplierCache)) {
                        let id = await supplierService.getSupplierId(row.supplier, user);
                        if (!id) {
                            const { newData, error: supplierError } = await supplierService.addSupplier({
                                name: row.supplier,
                                user_id: user.id,
                            });
                            if (supplierError) throw supplierError;
                            id = newData[0].id;
                        }
                        supplierCache[key] = id;
                    }
                    supplierId = supplierCache[key];
                }

                const subtotal = row.quantity * row.unit_price;
                await orderService.addOrder({
                    product_id: row.product_id,
                    quantity_ordered: row.quantity,
                    quantity_received: row.quantity,
                    unit_price: row.unit_price,
                    subtotal,
                    total_cost: subtotal,
                    supplier_id: supplierId,
                    expected_arrival: row.date.toISOString(),
                    actual_arrival: row.date.toISOString(),
                    status: 'Done',
                    notes: row.notes,
                    user_id: user.id,
                });
                imported++;
            } catch (err) {
                console.error('Failed to import row', row.product_id, err);
                failed++;
                failures.push({ id: row.product_id || `Row ${row.row}`, reason: err.message || 'Unknown error' });
            }
            setImportProgress(Math.round(((i + 1) / toImport.length) * 100));
        }

        setImportResults({ imported, failed, failures });
        setImporting(false);
        setActiveStep(3);
    };

    const statusChip = (status, reason) => {
        if (status === 'ok') return <Chip size="small" color="success" label="Ready" />;
        return <Chip size="small" color="error" label={reason} />;
    };

    const readyCount = previewRows.filter((r) => r.status === 'ok').length;
    const errorCount = previewRows.filter((r) => r.status === 'error').length;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    sx={{ backgroundColor: PRIMARY_COLOR, mr: 2 }}
                    onClick={handleBackClick}
                >
                    Back
                </Button>
                <Typography variant="h5" fontWeight={700}>Import Restock History</Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
                This records past restocks for reporting only - it will not change your current
                stock levels, since those already reflect what actually happened.
            </Alert>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {STEPS.map((label) => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
            </Stepper>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {activeStep === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center', border: '2px dashed', borderColor: 'grey.400' }}>
                    <UploadFileIcon sx={{ fontSize: 56, color: PRIMARY_COLOR, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>Upload your restock history</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Accepts .xlsx or .xls files. Each row is one restock event for a product
                        that already exists in your inventory.
                    </Typography>
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ backgroundColor: PRIMARY_COLOR, '&:hover': { backgroundColor: '#5a32a3' } }}
                    >
                        Choose File
                        <input type="file" accept=".xlsx,.xls" hidden onChange={handleFileChange} />
                    </Button>
                </Paper>
            )}

            {activeStep === 1 && (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        File: <strong>{fileName}</strong> ({rawRows.length} rows detected)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Match each field to the matching column from your file. Fields marked * are required.
                    </Typography>

                    <Grid container spacing={3}>
                        {FIELDS.map((f) => (
                            <Grid key={f.key} size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth required={f.required}>
                                    <InputLabel>{f.label}{f.required ? ' *' : ''}</InputLabel>
                                    <Select
                                        label={`${f.label}${f.required ? ' *' : ''}`}
                                        value={mapping[f.key] ?? ''}
                                        onChange={(e) => handleMappingChange(f.key, e.target.value)}
                                    >
                                        {!f.required && <MenuItem value=""><em>Not in file</em></MenuItem>}
                                        {headers.map((h, idx) => (
                                            <MenuItem key={idx} value={idx}>{h}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                        <Button onClick={() => setActiveStep(0)}>Back</Button>
                        <Button
                            variant="contained"
                            disabled={!canProceedFromMapping || preparingPreview}
                            onClick={handleBuildPreview}
                            sx={{ backgroundColor: PRIMARY_COLOR, '&:hover': { backgroundColor: '#5a32a3' } }}
                        >
                            {preparingPreview ? 'Checking...' : 'Preview'}
                        </Button>
                    </Box>
                </Paper>
            )}

            {activeStep === 2 && (
                <Paper sx={{ p: 4 }}>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Chip color="success" label={`${readyCount} ready`} />
                        {errorCount > 0 && <Chip color="error" label={`${errorCount} have errors`} />}
                    </Stack>

                    {importing && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>Importing... {importProgress}%</Typography>
                            <LinearProgress variant="determinate" value={importProgress} />
                        </Box>
                    )}

                    <TableContainer sx={{ maxHeight: 480, mb: 3 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Row</TableCell>
                                    <TableCell>Product ID</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Unit Price</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Supplier</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {previewRows.map((r) => (
                                    <TableRow key={r.row}>
                                        <TableCell>{r.row}</TableCell>
                                        <TableCell>{r.product_id}</TableCell>
                                        <TableCell>{Number.isFinite(r.quantity) ? r.quantity : '-'}</TableCell>
                                        <TableCell>{Number.isFinite(r.unit_price) ? r.unit_price : '-'}</TableCell>
                                        <TableCell>{r.date ? r.date.toLocaleDateString('id-ID') : '-'}</TableCell>
                                        <TableCell>{r.supplier || '-'}</TableCell>
                                        <TableCell>{statusChip(r.status, r.reason)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={() => setActiveStep(1)} disabled={importing}>Back</Button>
                        <Button
                            variant="contained"
                            disabled={readyCount === 0 || importing}
                            onClick={handleImport}
                            sx={{ backgroundColor: PRIMARY_COLOR, '&:hover': { backgroundColor: '#5a32a3' } }}
                        >
                            {importing ? 'Importing...' : `Import ${readyCount} Restocks`}
                        </Button>
                    </Box>
                </Paper>
            )}

            {activeStep === 3 && importResults && (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <CheckCircleIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>Import complete</Typography>
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ my: 2 }}>
                        <Chip color="success" label={`${importResults.imported} imported`} />
                        {importResults.failed > 0 && <Chip color="error" label={`${importResults.failed} failed`} />}
                    </Stack>

                    {importResults.failures.length > 0 && (
                        <Box sx={{ textAlign: 'left', maxWidth: 500, mx: 'auto', mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>Failures:</Typography>
                            {importResults.failures.map((f, i) => (
                                <Typography key={i} variant="body2" color="text.secondary">
                                    {f.id}: {f.reason}
                                </Typography>
                            ))}
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        sx={{ backgroundColor: PRIMARY_COLOR, '&:hover': { backgroundColor: '#5a32a3' } }}
                        onClick={() => navigate('/order')}
                    >
                        Go to Orders
                    </Button>
                </Paper>
            )}
        </Container>
    );
}

export default ImportRestockHistoryPage;
