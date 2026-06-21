import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { Paint, Brand } from '../types';
import { BRAND_BY_ID, PAINT_BY_ID } from '../constants';
import { Button } from '../components/ui/Button';
import { SwatchPreview } from '../components/SwatchPreview';
import { Download, ArrowLeft, FileText, Layers3, Palette } from 'lucide-react';
import { useComparison } from '../App';

const parseIds = (search: string) => {
  const queryParams = new URLSearchParams(search);
  return queryParams.get('ids')?.split(',').map(id => id.trim()).filter(Boolean) || [];
};

const areSameIds = (left: string[], right: string[]) => (
  left.length === right.length && left.every((id, index) => id === right[index])
);

const buildSearch = (ids: string[]) => {
  if (ids.length === 0) return '';

  return `?ids=${ids.join(',')}`;
};

const formatValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  return String(value);
};

const getBrand = (brandId: string): Brand | undefined => BRAND_BY_ID.get(brandId);

const loadImageDataUrl = async (src?: string | null) => {
  if (!src) return null;

  const response = await fetch(src);
  if (!response.ok) return null;

  const blob = await response.blob();

  return await new Promise<string | null>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(blob);
  });
};

const buildPdf = async (paints: Paint[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const cardGap = 6;
  const cardHeight = 38;
  const headerHeight = 42;
  const usableWidth = pageWidth - margin * 2;

  doc.setFillColor(247, 244, 239);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(20, 24, 31);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('TintMap Palette Builder', margin, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(82, 87, 95);
  doc.text(`Selected paints: ${paints.length}`, margin, 28);
  doc.text('Prototype export for artist planning and reference.', margin, 34);

  let y = headerHeight;

  for (let index = 0; index < paints.length; index += 1) {
    const paint = paints[index];
    const brand = getBrand(paint.brandId);

    if (y + cardHeight > pageHeight - margin) {
      doc.addPage();
      doc.setFillColor(247, 244, 239);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      y = margin;
    }

    const cardX = margin;
    const cardY = y;

    doc.setDrawColor(221, 226, 232);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cardX, cardY, usableWidth, cardHeight, 4, 4, 'FD');

    const imageX = cardX + 3;
    const imageY = cardY + 3;
    const imageSize = 32;

    const imageData = await loadImageDataUrl(paint.swatchImage);
    if (imageData) {
      try {
        doc.addImage(imageData, imageData.includes('image/png') ? 'PNG' : 'JPEG', imageX, imageY, imageSize, imageSize, undefined, 'FAST');
      } catch {
        if (paint.hex) {
          doc.setFillColor(240, 240, 240);
          doc.rect(imageX, imageY, imageSize, imageSize, 'F');
        }
      }
    } else {
      doc.setFillColor(240, 240, 240);
      doc.rect(imageX, imageY, imageSize, imageSize, 'F');
    }

    const textX = imageX + imageSize + 5;
    let textY = cardY + 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(20, 24, 31);
    doc.text(paint.name, textX, textY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(94, 99, 108);
    textY += 5;
    doc.text(`${brand?.name || 'Unknown brand'} • ${formatValue(paint.paintNumber)}`, textX, textY);
    textY += 5;
    doc.text(`Pigments: ${formatValue(paint.pigmentCodes)}`, textX, textY);
    textY += 5;
    doc.text(
      `Transparency: ${formatValue(paint.transparency)}  |  Staining: ${formatValue(paint.staining)}  |  Granulation: ${formatValue(paint.granulation)}`,
      textX,
      textY,
      { maxWidth: usableWidth - imageSize - 12 }
    );
    textY += 5;
    doc.text(
      `Lightfastness: ${formatValue(paint.lightfastness)}  |  Vegan: ${paint.isVegan ? 'Yes' : 'No'}  |  Collection: ${formatValue(paint.collection)}`,
      textX,
      textY,
      { maxWidth: usableWidth - imageSize - 12 }
    );

    y += cardHeight + cardGap;
  }

  return doc.output('blob');
};

export const PaletteBuilder: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPaintIds, clearSelection, setSelection } = useComparison();
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const lastSyncedSearchRef = useRef<string | null>(null);
  const queryIds = useMemo(() => parseIds(location.search), [location.search]);
  const selectedPaints = useMemo(
    () => selectedPaintIds.map((id) => PAINT_BY_ID.get(id)).filter((paint): paint is Paint => Boolean(paint)),
    [selectedPaintIds]
  );

  useLayoutEffect(() => {
    if (queryIds.length === 0) {
      if (lastSyncedSearchRef.current === null) {
        lastSyncedSearchRef.current = location.search;
      }
      return;
    }

    if (location.search === lastSyncedSearchRef.current) return;

    const sanitizedQueryIds = queryIds.filter((id) => PAINT_BY_ID.has(id));

    if (!areSameIds(selectedPaintIds, sanitizedQueryIds)) {
      setSelection(sanitizedQueryIds);
    }

    lastSyncedSearchRef.current = location.search;
  }, [queryIds, selectedPaintIds, setSelection]);

  useEffect(() => {
    const nextSearch = buildSearch(selectedPaintIds);
    if (location.search === nextSearch) return;

    lastSyncedSearchRef.current = nextSearch;
    navigate({ pathname: location.pathname, search: nextSearch }, { replace: true });
  }, [location.pathname, location.search, navigate, selectedPaintIds]);

  const handleDownload = async () => {
    if (selectedPaints.length === 0 || isExporting) return;

    setIsExporting(true);
    setExportMessage(null);
    try {
      const blob = await buildPdf(selectedPaints);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `tintmap-palette-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportMessage('PDF download started.');
    } catch (error) {
      console.error('Palette PDF export failed', error);
      setExportMessage('We could not create the PDF right now. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (selectedPaints.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Palette className="mx-auto mb-4 text-sky-700" size={40} />
        <h1 className="text-3xl font-bold text-neutral-900">No palette selected</h1>
        <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
          Add paints to the compare tray first, then open the Palette Builder to generate a printable PDF.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/paints">
            <Button className="gap-2">
              <ArrowLeft size={16} />
              Browse paints
            </Button>
          </Link>
          <Link to="/brands">
            <Button variant="outline">Browse brands</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main id="palette-builder-page" aria-label="TintMap Palette Builder" className="min-h-screen bg-neutral-50 pb-20">
      <section id="palette-builder-hero" className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-800">
              <Layers3 size={13} />
              Palette Builder
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-950">Build a palette and export it as a PDF.</h1>
            <p className="text-neutral-600 leading-relaxed">
              This prototype turns your selected paints into a printable palette sheet with swatches and paint data,
              so you can review a working set together before you paint.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                clearSelection();
                navigate('/palette-builder', { replace: true });
              }}
            >
              <ArrowLeft size={16} />
              Clear selection
            </Button>
            <Button className="gap-2" onClick={handleDownload} disabled={isExporting}>
              <Download size={16} />
              {isExporting ? 'Creating PDF...' : 'Download PDF'}
            </Button>
          </div>
          {exportMessage && (
            <p className="text-sm text-neutral-600 lg:text-right">{exportMessage}</p>
          )}
        </div>
      </section>

      <section id="palette-builder-selection" aria-label="Selected paints" className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Selected paints</h2>
            <p className="text-sm text-neutral-500">{selectedPaints.length} paints in this palette</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
            <FileText size={13} />
            Printable preview
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {selectedPaints.map(paint => {
            const brand = getBrand(paint.brandId);
            return (
              <article key={paint.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="aspect-[5/3] bg-neutral-50">
                  <SwatchPreview
                    src={paint.swatchImage}
                    alt={`${paint.name} swatch`}
                    variant="card"
                    className="h-full w-full object-cover"
                    labelClassName="block text-[9px] leading-none"
                  />
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">{brand?.name || 'Unknown brand'}</p>
                    <h3 className="mt-1 text-lg font-bold text-neutral-950">{paint.name}</h3>
                    <p className="mt-1 text-sm text-neutral-500">Paint no. {formatValue(paint.paintNumber)}</p>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div>
                      <dt className="text-neutral-500">Pigments</dt>
                      <dd className="font-medium text-neutral-900">{formatValue(paint.pigmentCodes)}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Transparency</dt>
                      <dd className="font-medium text-neutral-900">{formatValue(paint.transparency)}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Staining</dt>
                      <dd className="font-medium text-neutral-900">{formatValue(paint.staining)}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Granulation</dt>
                      <dd className="font-medium text-neutral-900">{formatValue(paint.granulation)}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Lightfastness</dt>
                      <dd className="font-medium text-neutral-900">{formatValue(paint.lightfastness)}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Vegan</dt>
                      <dd className="font-medium text-neutral-900">{paint.isVegan ? 'Yes' : 'No'}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};
