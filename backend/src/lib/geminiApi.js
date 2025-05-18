export const rubricPrompt = (userPrompt) => {
  return `
    Create a detailed analytical rubric based on the following requirements:
    ${userPrompt}
    
    Important guidelines:
    - The rubric should be comprehensive but concise
    - Each scoring level must have a clear description
    - Descriptors must match the number of scoring levels
    - Each criterion should be clearly defined
    - Ensure consistency across all scoring levels
     `;
};
