// Obsidian Note Plugin - Background Script

declare const PluginAPI: any;
declare const PluginHooks: any;

console.log('Obsidian Note plugin loaded');

let vaultPath: string | null = null;

const getVaultPath = async (): Promise<string | null> => {
  if (vaultPath) {
    return vaultPath;
  }

  const config = await PluginAPI.getConfig();
  if (config && config.vaultPath) {
    vaultPath = config.vaultPath;
    return vaultPath;
  }

  return null;
};

const writeNote = async (taskId: string, content: string): Promise<void> => {
  const vault = await getVaultPath();
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
};

const readNote = async (taskId: string): Promise<string | null> => {
  const vault = await getVaultPath();
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
};

PluginAPI.registerSidePanelButton({
  label: 'Obsidian Note',
  icon: 'icon.svg',
  onClick: () => {
    PluginAPI.showIndexHtmlAsView();
  },
});

PluginAPI.registerHook(PluginHooks.TASK_UPDATE, async (task: any) => {
  console.log('Task updated:', task);

  const note = await readNote(task.id);
  if (note && task.notes !== note) {
    PluginAPI.updateTask(task.id, { notes: note });
  } else if (!note && task.notes) {
    await writeNote(task.id, task.notes);
  }
});
