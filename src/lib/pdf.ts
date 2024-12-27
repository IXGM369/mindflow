import { WeeklyReflection } from './types/focus';

export async function generatePDF(reflection: WeeklyReflection) {
  // Create the content for the PDF
  const content = `
Weekly Reflection Report
Week Starting: ${new Date(reflection.week_start).toLocaleDateString()}

Achievements:
${reflection.achievements?.map(a => `- ${a}`).join('\n') || 'None recorded'}

Areas for Improvement:
${reflection.improvements?.map(i => `- ${i}`).join('\n') || 'None recorded'}

Distractions:
${reflection.distractions?.map(d => `- ${d}`).join('\n') || 'None recorded'}

Goals for Next Week:
${reflection.next_week_goals?.map(g => `- ${g}`).join('\n') || 'None recorded'}

Scores:
Energy Level: ${reflection.energy_score}/5
Productivity: ${reflection.productivity_score}/5
  `.trim();

  // Create a Blob with the content
  const blob = new Blob([content], { type: 'text/plain' });
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `weekly-reflection-${reflection.week_start}.txt`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}