
import html2canvas from 'html2canvas';

export const exportToPng = async (elementId: string, fileName: string = 'eid-banner'): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error("Element to export not found");
    }
    
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 2, // Higher scale for better quality
    });
    
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    return Promise.reject(error);
  }
};
