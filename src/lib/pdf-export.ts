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

  const originalBackground = element.style.background;
  element.style.background = '#ffffff';

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5, // High resolution for crisp text & SVGs
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;
    let xOffset = 0;

    // Smart 1-page fit: If document is close to 1 page (up to ~15% over), scale to fit cleanly on 1 page!
    if (imgHeight > pageHeight && imgHeight < pageHeight * 1.18) {
      const scaleFactor = pageHeight / imgHeight;
      imgWidth = imgWidth * scaleFactor;
      imgHeight = pageHeight;
      xOffset = (pageWidth - imgWidth) / 2; // center horizontally
    }

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', xOffset, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Handle subsequent pages only if document is legitimately multi-page (e.g. 10+ items)
    while (heightLeft > 10) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', xOffset, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
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
