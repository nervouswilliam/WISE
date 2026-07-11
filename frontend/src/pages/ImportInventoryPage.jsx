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

const PRIMARY_COLOR = '#6f42c1';
const STEPS = ['Upload file', 'Map columns', 'Review & import'];

// low_stock is the only non-identity required-ish field with a sensible default (0),
// so a blank/invalid value there degrades gracefully instead of failing the row.
const FIELDS = [
    { key: 'id', label: 'Product ID', required: true },
    { key: 'name', label: 'Name', required: true },
    { key: 'price', label: 'Cost Price', required: true },
    { key: 'selling_price', label: 'Selling Price', required: true },
    { key: 'stock', label: 'Stock', required: true },
    { key: 'low_stock', label: 'Low Stock Threshold', required: false },
    { key: 'category', label: 'Category', required: false },
    { key: 'supplier', label: 'Supplier', required: false },
];

const toText = (v) => (v === null || v === undefined ? '' : String(v).trim());
const toNumber = (v) => {
    const n = Number(String(v ?? '').replace(/,/g, '').trim());
    return Number.isFinite(n) ? n : NaN;
};

function ImportInventoryPage({ user }) {
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
                // row.values is 1-indexed; drop the leading empty slot.
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

            // Best-effort auto-map: match field keys/labels against header text.
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

            const seenIds = new Set();
            const rows = rawRows.map((raw, i) => {
                const get = (key) => (mapping[key] !== undefined ? raw[mapping[key]] : undefined);

                const id = toText(get('id'));
                const name = toText(get('name'));
                const price = toNumber(get('price'));
                const sellingPrice = toNumber(get('selling_price'));
                const stock = toNumber(get('stock'));
                const lowStockRaw = toNumber(get('low_stock'));
                const lowStock = Number.isFinite(lowStockRaw) ? lowStockRaw : 0;
                const category = toText(get('category'));
                const supplier = toText(get('supplier'));

                let status = 'ok';
                let reason = '';

                if (!id) { status = 'error'; reason = 'Missing Product ID'; }
                else if (!name) { status = 'error'; reason = 'Missing Name'; }
                else if (!Number.isFinite(price)) { status = 'error'; reason = 'Invalid Cost Price'; }
                else if (!Number.isFinite(sellingPrice)) { status = 'error'; reason = 'Invalid Selling Price'; }
                else if (!Number.isFinite(stock)) { status = 'error'; reason = 'Invalid Stock'; }
                else if (seenIds.has(id)) { status = 'error'; reason = 'Duplicate ID in this file'; }
                else if (existingIds.has(id)) { status = 'skipped'; reason = 'Product ID already exists'; }

                if (status !== 'error' && id) seenIds.add(id);

                return {
                    row: i + 2, // +1 for header row, +1 for 1-indexing
                    id, name, price, selling_price: sellingPrice, stock, low_stock: lowStock,
                    category: category || null, supplier: supplier || null,
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
        const skipped = previewRows.filter((r) => r.status === 'skipped').length;

        const categoryCache = {};
        const supplierCache = {};
        let imported = 0;
        let failed = 0;
        const failures = [];

        for (let i = 0; i < toImport.length; i++) {
            const row = toImport[i];
            try {
                let categoryData;
                if (row.category) {
                    const key = row.category.toLowerCase();
                    if (!(key in categoryCache)) {
                        let id = await productService.getCategoryId(row.category, user);
                        if (!id) id = await productService.createCategory(row.category, user.id);
                        categoryCache[key] = id;
                    }
                    categoryData = { category_id: categoryCache[key] };
                }

                let supplierData;
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
                    supplierData = { supplier_id: supplierCache[key] };
                }

                await productService.addProductDetail(
                    {
                        id: row.id,
                        name: row.name,
                        price: row.price,
                        selling_price: row.selling_price,
                        stock: row.stock,
                        low_stock: row.low_stock,
                        image_url: '',
                        user_id: user.id,
                    },
                    categoryData,
                    supplierData
                );
                imported++;
            } catch (err) {
                console.error('Failed to import row', row.id, err);
                failed++;
                failures.push({ id: row.id || `Row ${row.row}`, reason: err.message || 'Unknown error' });
            }
            setImportProgress(Math.round(((i + 1) / toImport.length) * 100));
        }

        setImportResults({ imported, skipped, failed, failures });
        setImporting(false);
        setActiveStep(3);
    };

    const statusChip = (status, reason) => {
        if (status === 'ok') return <Chip size="small" color="success" label="Ready" />;
        if (status === 'skipped') return <Chip size="small" color="default" label={`Skipped - ${reason}`} />;
        return <Chip size="small" color="error" label={reason} />;
    };

    const readyCount = previewRows.filter((r) => r.status === 'ok').length;
    const skippedCount = previewRows.filter((r) => r.status === 'skipped').length;
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
                <Typography variant="h5" fontWeight={700}>Import Inventory from Excel</Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {STEPS.map((label) => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
            </Stepper>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {activeStep === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center', border: '2px dashed', borderColor: 'grey.400' }}>
                    <UploadFileIcon sx={{ fontSize: 56, color: PRIMARY_COLOR, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>Upload your existing inventory</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Accepts .xlsx or .xls files. The first row should be your column headers -
                        you'll match them to the right fields on the next step.
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
                        <Chip color="default" label={`${skippedCount} will be skipped (already exist)`} />
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
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Cost Price</TableCell>
                                    <TableCell>Selling Price</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Supplier</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {previewRows.map((r) => (
                                    <TableRow key={r.row}>
                                        <TableCell>{r.row}</TableCell>
                                        <TableCell>{r.id}</TableCell>
                                        <TableCell>{r.name}</TableCell>
                                        <TableCell>{Number.isFinite(r.price) ? r.price : '-'}</TableCell>
                                        <TableCell>{Number.isFinite(r.selling_price) ? r.selling_price : '-'}</TableCell>
                                        <TableCell>{Number.isFinite(r.stock) ? r.stock : '-'}</TableCell>
                                        <TableCell>{r.category || '-'}</TableCell>
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
                            {importing ? 'Importing...' : `Import ${readyCount} Products`}
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
                        <Chip color="default" label={`${importResults.skipped} skipped (duplicates)`} />
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
                        onClick={() => navigate('/warehouse')}
                    >
                        Go to Warehouse
                    </Button>
                </Paper>
            )}
        </Container>
    );
}

export default ImportInventoryPage;
