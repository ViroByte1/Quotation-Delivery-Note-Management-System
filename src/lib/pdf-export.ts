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

  // Temporarily reset box shadow and outer border for ultra-crisp capture
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
            text-rendering: geometricPrecision !important;
          }
        `;
        clonedDoc.head.appendChild(style);

        const el = clonedDoc.getElementById(elementId);
        if (el) {
          el.style.boxShadow = 'none';
          el.style.border = 'none';
          el.style.margin = '0 auto';
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

    const pageWidth = 210;   // A4 mm
    const pageHeight = 297;  // A4 mm

    // Accurate proportional scaling to fit A4 page width
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height / canvas.width) * pageWidth;
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Guaranteed 1-page fit for standard business quotations & delivery notes
    if (imgHeight <= pageHeight * 1.15) {
      const scaleFactor = imgHeight > pageHeight ? pageHeight / imgHeight : 1;
      const finalWidth = imgWidth * scaleFactor;
      const finalHeight = imgHeight * scaleFactor;
      const xOffset = (pageWidth - finalWidth) / 2;
      const yOffset = (pageHeight - finalHeight) / 5;
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
    } else {
      // Clean multi-page handling if document has many items
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 5) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
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
