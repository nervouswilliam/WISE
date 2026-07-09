import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, List,
  ListItemButton, ListItemText, ListSubheader, Typography, IconButton, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { WIDGET_REGISTRY } from './widgetRegistry';

// Renders the widget for real, then - if it turned out to contain a recharts SVG chart -
// freezes it into a static <img> snapshot instead of leaving it live. A live chart inside
// a Dialog that's still running its open transition tends to measure its container mid-
// animation and render squished/blank, since ResponsiveContainer's ResizeObserver doesn't
// reliably catch the transition's final size. A static snapshot sidesteps that entirely.
// Non-chart widgets (KPI cards, tables) have no such timing issue, so they're left live.
function WidgetPreview({ Component, data, extraProps }) {
  const liveRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    setImgSrc(null);
    let cancelled = false;

    // A timer (not requestAnimationFrame) so this still fires in a backgrounded/inactive
    // tab - a Dialog can open while the tab isn't focused, and rAF gets throttled or
    // paused entirely in that case. This just needs to run after recharts' next paint,
    // which a short delay covers reliably either way.
    const timer = setTimeout(() => {
      if (cancelled) return;
      const svg = liveRef.current?.querySelector('.recharts-wrapper svg');
      if (svg) {
        const serialized = new XMLSerializer().serializeToString(svg);
        setImgSrc(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [Component]);

  return (
    <Box sx={{ height: '100%' }}>
      <Box ref={liveRef} sx={{ height: '100%', visibility: imgSrc ? 'hidden' : 'visible', ...(imgSrc && { position: 'absolute', pointerEvents: 'none' }) }}>
        <Component data={data} editMode {...extraProps} />
      </Box>
      {imgSrc && (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={imgSrc} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </Box>
      )}
    </Box>
  );
}

// Renders the picked widget's real component against the dashboard's real (already-loaded)
// data, so the preview is pixel-accurate instead of a mocked-up stand-in.
function AddWidgetDialog({ open, onClose, availableToAdd, data, onAdd }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (open) setSelectedId(availableToAdd[0] || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const selectedDef = selectedId ? WIDGET_REGISTRY[selectedId] : null;
  const PreviewComponent = selectedDef?.component;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={isMobile}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Add Widget
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 0 }}>
        <Box
          sx={{
            width: { xs: '100%', sm: 240 },
            flexShrink: 0,
            borderRight: { sm: `1px solid ${theme.palette.divider}` },
            borderBottom: { xs: `1px solid ${theme.palette.divider}`, sm: 'none' },
            maxHeight: { xs: 200, sm: 480 },
            overflowY: 'auto',
          }}
        >
          <List dense disablePadding>
            {['KPI', 'Chart'].flatMap((category) => {
              const items = availableToAdd.filter((id) => WIDGET_REGISTRY[id].category === category);
              if (items.length === 0) return [];
              return [
                <ListSubheader key={`header-${category}`}>
                  {category === 'KPI' ? 'KPI Cards' : 'Charts & Tables'}
                </ListSubheader>,
                ...items.map((id) => (
                  <ListItemButton key={id} selected={id === selectedId} onClick={() => setSelectedId(id)}>
                    <ListItemText primary={WIDGET_REGISTRY[id].title} />
                  </ListItemButton>
                )),
              ];
            })}
            {availableToAdd.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                All widgets have already been added.
              </Typography>
            )}
          </List>
        </Box>

        <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', minHeight: 360 }}>
          {selectedDef ? (
            <>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
                {selectedDef.title}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  minHeight: 280,
                  backgroundColor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ height: '100%', overflow: 'auto', position: 'relative' }}>
                  <WidgetPreview Component={PreviewComponent} data={data} extraProps={selectedDef.props || {}} />
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                Preview using your current dashboard data. It'll be added to the bottom of
                your layout — you can drag and resize it afterward.
              </Typography>
            </>
          ) : (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Nothing left to add.</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled={!selectedDef}
          onClick={() => selectedId && onAdd(selectedId)}
          sx={{ backgroundColor: '#6f42c1', '&:hover': { backgroundColor: '#5a34a8' } }}
        >
          Add to Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddWidgetDialog;
