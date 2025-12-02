declare const PluginAPI: any;

async function main() {
  const task = await PluginAPI.getCurrentTask();
  if (!task) {
    document.body.innerHTML = '<h1>No task selected</h1>';
    return;
  }

  const vault = (await PluginAPI.getConfig()).vaultPath;
  if (!vault) {
    document.body.innerHTML = '<h1>Obsidian vault path not configured</h1>';
    return;
  }

  const note = await readNote(task.id);

  document.body.innerHTML = `
    <textarea id="note-content" style="width: 100%; height: 80%"></textarea>
    <button id="open-in-obsidian">Open in Obsidian</button>
  `;

  const textarea = document.getElementById('note-content') as HTMLTextAreaElement;
  textarea.value = note || '';

  textarea.addEventListener('blur', async () => {
    await writeNote(task.id, textarea.value);
  });

  const openInObsidianButton = document.getElementById('open-in-obsidian');
  openInObsidianButton.addEventListener('click', () => {
    const obsidianUrl = `obsidian://open?vault=${encodeURIComponent(
      vault,
    )}&file=${encodeURIComponent(task.id + '.md')}`;
    window.open(obsidianUrl, '_blank');
  });
}

async function readNote(taskId: string): Promise<string | null> {
  const vault = (await PluginAPI.getConfig()).vaultPath;
  if (!vault) {
    console.error('Obsidian vault path not configured.');
    return null;
  }

  const filePath = `${vault}/${taskId}.md`;
  const result = await PluginAPI.executeNodeScript({
    script: `
      const fs = require('fs');
      if (fs.existsSync('${filePath}')) {
        return fs.readFileSync('${filePath}', 'utf-8');
      }
      return null;
    `,
  });

  return result.stdout;
}

async function writeNote(taskId: string, content: string): Promise<void> {
  const vault = (await PluginAPI.getConfig()).vaultPath;
  if (!vault) {
    console.error('Obsidian vault path not configured.');
    return;
  }

  const filePath = `${vault}/${taskId}.md`;
  await PluginAPI.executeNodeScript({
    script: `
      const fs = require('fs');
      fs.writeFileSync('${filePath}', \`${content}\`);
    `,
  });
}

main();
