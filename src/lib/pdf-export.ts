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

  // Pre-wait for web fonts (Cairo, Inter) so Arabic cursive ligatures render flawlessly
  if ((document as any).fonts?.ready) {
    try {
      await (document as any).fonts.ready;
    } catch {
      // Continue if font API is not fully supported
    }
  }

  const originalBackground = element.style.background;
  element.style.background = '#ffffff';

  try {
    // Force standard 794px desktop width capture so mobile viewports never collapse the document
    const canvas = await html2canvas(element, {
      scale: 2.5, // Crisp 300 DPI vector-like clarity
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 1200, // Forces desktop CSS breakpoint resolution inside html2canvas
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;
    
    // Exact proportional scaling to standard A4
    const aspectRatio = canvas.height / canvas.width;
    let imgWidth = pageWidth;
    let imgHeight = imgWidth * aspectRatio;
    let xOffset = 0;

    // Guaranteed 1-page fit for standard business quotations/delivery notes
    if (imgHeight <= pageHeight * 1.15) {
      if (imgHeight > pageHeight) {
        const factor = pageHeight / imgHeight;
        imgWidth = imgWidth * factor;
        imgHeight = pageHeight;
        xOffset = (pageWidth - imgWidth) / 2;
      }
      pdf.addImage(imgData, 'JPEG', xOffset, 0, imgWidth, imgHeight, undefined, 'FAST');
    } else {
      // Legitimate multi-page document fallback (e.g. 15+ order items)
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', xOffset, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', xOffset, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  } finally {
    element.style.background = originalBackground;
  }
}

export function printDocument(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
