import React, { useEffect, useState } from 'react';
import {
  Box, Button, IconButton, Menu, MenuItem, ListItemText, ListSubheader,
  FormControl, Select, Typography, useMediaQuery, Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ReactGridLayout, { useContainerWidth } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useDashboardData } from './useDashboardData';
import { WIDGET_REGISTRY, WIDGET_IDS } from './widgetRegistry';
import { PRESETS, DEFAULT_PRESET_KEY } from './presets';
import authService from '../services/authService';
import Loading from '../components/loading';
import { formatCurrency } from '../utils/currency';

const ROW_HEIGHT = 70;
const COLS = 12;

function cloneLayoutFromPreset(presetKey) {
  const preset = PRESETS[presetKey] || PRESETS[DEFAULT_PRESET_KEY];
  return {
    widgets: [...preset.widgets],
    layout: preset.layout.map((item) => ({ ...item })),
  };
}

function DashboardGrid({ user }) {
  const data = useDashboardData(user);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { width, containerRef, mounted } = useContainerWidth();

  const [editMode, setEditMode] = useState(false);
  const [presetKey, setPresetKey] = useState(DEFAULT_PRESET_KEY);
  const [widgets, setWidgets] = useState([]);
  const [layout, setLayout] = useState([]);
  const [addMenuAnchor, setAddMenuAnchor] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Load the user's saved layout (stored on their account, same mechanism Settings uses
  // for profile fields), or fall back to the default preset on first-ever visit.
  useEffect(() => {
    if (!user || initialized) return;
    const saved = user.dashboardLayout;
    if (saved && Array.isArray(saved.widgets) && Array.isArray(saved.layout) && saved.widgets.length > 0) {
      setWidgets(saved.widgets);
      setLayout(saved.layout);
      setPresetKey(saved.presetKey || 'custom');
    } else {
      const { widgets: w, layout: l } = cloneLayoutFromPreset(DEFAULT_PRESET_KEY);
      setWidgets(w);
      setLayout(l);
      setPresetKey(DEFAULT_PRESET_KEY);
    }
    setInitialized(true);
  }, [user, initialized]);

  const persist = async (nextWidgets, nextLayout, nextPresetKey) => {
    try {
      const currentUser = await authService.whoami();
      const metadata = currentUser.user_metadata || {};
      await authService.updateUser({
        ...metadata,
        dashboardLayout: { widgets: nextWidgets, layout: nextLayout, presetKey: nextPresetKey },
      });
    } catch (err) {
      console.error('Failed to save dashboard layout:', err);
    }
  };

  const handleToggleEdit = () => {
    if (editMode) {
      persist(widgets, layout, presetKey);
    }
    setEditMode((v) => !v);
  };

  const handlePresetChange = (e) => {
    const key = e.target.value;
    const { widgets: w, layout: l } = cloneLayoutFromPreset(key);
    setWidgets(w);
    setLayout(l);
    setPresetKey(key);
    persist(w, l, key);
  };

  // react-grid-layout fires onLayoutChange on mount too (its own compaction pass), not
  // just from real drag/resize - only treat it as a user edit while actually in edit mode,
  // otherwise a fresh page load immediately downgrades a saved preset to "custom".
  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    if (editMode) {
      setPresetKey('custom');
    }
  };

  const handleRemoveWidget = (id) => {
    const nextWidgets = widgets.filter((w) => w !== id);
    const nextLayout = layout.filter((item) => item.i !== id);
    setWidgets(nextWidgets);
    setLayout(nextLayout);
    setPresetKey('custom');
  };

  const handleAddWidget = (id) => {
    const def = WIDGET_REGISTRY[id];
    if (!def) return;
    const maxY = layout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
    const nextWidgets = [...widgets, id];
    const nextLayout = [
      ...layout,
      { i: id, x: 0, y: maxY, w: def.defaultSize.w, h: def.defaultSize.h, minW: def.defaultSize.minW, minH: def.defaultSize.minH },
    ];
    setWidgets(nextWidgets);
    setLayout(nextLayout);
    setPresetKey('custom');
    setAddMenuAnchor(null);
  };

  const handleGenerateReport = () => {
    const headers = ['ID', 'Total (Rp)', 'Type', 'Date'];
    const rows = data.recentTransactions.map((t) => {
      const formattedTotal = formatCurrency(t.total_amount);
      const formattedDate = new Date(t.created_at).toLocaleDateString('id-ID');
      return [t.transaction_id, formattedTotal, t.transaction_type, formattedDate].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'recent_transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const actionButtons = (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
      <Button
        variant="contained"
        sx={{ backgroundColor: '#6f42c1' }}
        startIcon={<AddIcon />}
        onClick={() => navigate('/product/add')}
      >
        Add Product
      </Button>
      <Button
        variant="contained"
        sx={{ backgroundColor: '#6f42c1' }}
        startIcon={<AddIcon />}
        onClick={() => navigate('/supplier/add')}
      >
        Add Supplier
      </Button>
      <Button
        variant="contained"
        color="success"
        startIcon={<GetAppIcon />}
        onClick={handleGenerateReport}
      >
        Generate Report
      </Button>
    </Box>
  );

  const availableToAdd = WIDGET_IDS.filter((id) => !widgets.includes(id));

  if (data.loading || !initialized) {
    return <Loading />;
  }

  if (data.error) {
    return <Typography color="error" sx={{ p: 4 }}>{data.error}</Typography>;
  }

  // Mobile: skip the drag/resize grid and just stack active widgets in saved order -
  // dragging/resizing isn't practical on a small touch screen.
  if (isMobile) {
    const orderedWidgets = [...layout].sort((a, b) => a.y - b.y || a.x - b.x).map((item) => item.i);
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {orderedWidgets.map((id) => {
          const def = WIDGET_REGISTRY[id];
          if (!def) return null;
          const WidgetComponent = def.component;
          return (
            <Box key={id} sx={{ backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3, p: 2, minHeight: 160 }}>
              <WidgetComponent data={data} editMode={false} {...(def.props || {})} />
            </Box>
          );
        })}
        <Divider />
        {actionButtons}
      </Box>
    );
  }

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select value={PRESETS[presetKey] ? presetKey : 'custom'} onChange={handlePresetChange}>
            {Object.entries(PRESETS).map(([key, preset]) => (
              <MenuItem key={key} value={key}>{preset.label}</MenuItem>
            ))}
            {!PRESETS[presetKey] && <MenuItem value="custom" disabled>Custom Layout</MenuItem>}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {editMode && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={(e) => setAddMenuAnchor(e.currentTarget)}
              disabled={availableToAdd.length === 0}
            >
              Add Widget
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={editMode ? <CheckIcon /> : <EditIcon />}
            onClick={handleToggleEdit}
            sx={{ backgroundColor: '#6f42c1', '&:hover': { backgroundColor: '#5a34a8' } }}
          >
            {editMode ? 'Done Editing' : 'Customize Dashboard'}
          </Button>
        </Box>

        <Menu anchorEl={addMenuAnchor} open={Boolean(addMenuAnchor)} onClose={() => setAddMenuAnchor(null)}>
          {['KPI', 'Chart'].flatMap((category) => {
            const items = availableToAdd.filter((id) => WIDGET_REGISTRY[id].category === category);
            if (items.length === 0) return [];
            return [
              <ListSubheader key={`header-${category}`}>{category === 'KPI' ? 'KPI Cards' : 'Charts & Tables'}</ListSubheader>,
              ...items.map((id) => (
                <MenuItem key={id} onClick={() => handleAddWidget(id)}>
                  <ListItemText>{WIDGET_REGISTRY[id].title}</ListItemText>
                </MenuItem>
              )),
            ];
          })}
          {availableToAdd.length === 0 && <MenuItem disabled>All widgets added</MenuItem>}
        </Menu>
      </Box>

      {/* Grid */}
      <div ref={containerRef}>
        {mounted && (
          <ReactGridLayout
            width={width}
            layout={layout}
            gridConfig={{ cols: COLS, rowHeight: ROW_HEIGHT, margin: [16, 16] }}
            dragConfig={{ enabled: editMode }}
            resizeConfig={{ enabled: editMode, handles: ['se'] }}
            onLayoutChange={handleLayoutChange}
          >
            {widgets.map((id) => {
              const def = WIDGET_REGISTRY[id];
              if (!def) return null;
              const WidgetComponent = def.component;
              return (
                <div key={id}>
                  <Box
                    sx={{
                      height: '100%',
                      position: 'relative',
                      backgroundColor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: 3,
                      p: 2,
                      overflow: 'hidden',
                      ...(editMode && {
                        outline: '2px dashed #6f42c1',
                        outlineOffset: 2,
                        cursor: 'move',
                      }),
                    }}
                  >
                    {editMode && (
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleRemoveWidget(id); }}
                        sx={{
                          position: 'absolute', top: 4, right: 4, zIndex: 10,
                          backgroundColor: 'rgba(0,0,0,0.55)', color: 'white',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.75)' },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                    <Box sx={{ height: '100%', overflow: 'auto', pointerEvents: editMode ? 'none' : 'auto' }}>
                      <WidgetComponent data={data} editMode={editMode} {...(def.props || {})} />
                    </Box>
                  </Box>
                </div>
              );
            })}
          </ReactGridLayout>
        )}
      </div>

      <Divider sx={{ my: 3 }} />
      {actionButtons}
    </Box>
  );
}

export default DashboardGrid;
