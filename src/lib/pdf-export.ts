export async function exportToPDF(elementId: string, filename: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const html2canvasModule = await import('html2canvas');
  const html2canvas = html2canvasModule.default || html2canvasModule;

  const jsPDFModule = await import('jspdf');
  const jsPDF = jsPDFModule.default || jsPDFModule;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found for PDF export.`);
  }

  // Wait for fonts to load
  if ((document as any).fonts?.ready) {
    try { await (document as any).fonts.ready; } catch { /* continue */ }
  }

  const prevBoxShadow = element.style.boxShadow;
  const prevBorder = element.style.border;
  element.style.boxShadow = 'none';
  element.style.border = 'none';

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      onclone: (clonedDoc) => {
        const style = clonedDoc.createElement('style');
        style.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        `;
        clonedDoc.head.appendChild(style);
        const el = clonedDoc.getElementById(elementId);
        if (el) {
          el.style.boxShadow = 'none';
          el.style.border = 'none';
          el.style.width = '794px';
          el.style.minWidth = '794px';
          el.style.maxWidth = '794px';
        }
      },
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = 210;    // A4 width in mm
    const pageHeight = 297;   // A4 height in mm

    // Scale the captured canvas to fit A4 width
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height / canvas.width) * pageWidth;
    const imgData = canvas.toDataURL('image/png');

    if (imgHeight <= pageHeight) {
      // Fits on one page — place at top-left corner (NO y-offset, never clip bottom)
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    } else if (imgHeight <= pageHeight * 1.3) {
      // Slightly over one page — shrink to fit entirely on one page
      const scale = pageHeight / imgHeight;
      const scaledW = imgWidth * scale;
      const scaledH = pageHeight;
      const xOff = (pageWidth - scaledW) / 2;
      pdf.addImage(imgData, 'PNG', xOff, 0, scaledW, scaledH, undefined, 'FAST');
    } else {
      // Genuine multi-page (many items): slice across pages
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      while (heightLeft > 5) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  } finally {
    element.style.boxShadow = prevBoxShadow;
    element.style.border = prevBorder;
  }
}

export function printDocument(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
