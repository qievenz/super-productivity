// Obsidian Note Plugin - Background Script

import { PluginHooks } from '@super-productivity/plugin-api';

declare const PluginAPI: any;

console.log('Obsidian Note plugin loaded');

let vaultPath: string | null = null;

const getVaultPath = async (): Promise<string | null> => {
  if (vaultPath) {
    console.log('Obsidian using cached vaultPath:', vaultPath);
    return vaultPath;
  }

  const config = await PluginAPI.getConfig();
  if (config && config.vaultPath) {
    vaultPath = config.vaultPath;
    console.log('Obsidian loaded vaultPath from config:', vaultPath);
    return vaultPath;
  }
  console.warn('Obsidian vault path not configured.');
  return null;
};

const writeNote = async (projectId: string, content: string): Promise<void> => {
  const vault = await getVaultPath();
  if (!vault) {
    console.error('Obsidian vault path not configured, cannot write note.');
    return;
  }

  const filePath = `${vault}/project_${projectId}.md`;
  console.log('Obsidian attempting to write note to:', filePath);

  await PluginAPI.executeNodeScript({
    script: `
      const fs = require('fs');
      const path = require('path');
      const dir = path.dirname('${filePath}');
      if (!fs.existsSync(dir)) {
        console.log('Obsidian creating directory:', dir);
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync('${filePath}', \`${content}\`);
      console.log('Obsidian successfully wrote note to:', '${filePath}');
    `,
  });
};

const readNote = async (projectId: string): Promise<string | null> => {
  const vault = await getVaultPath();
  if (!vault) {
    console.error('Obsidian vault path not configured, cannot read note.');
    return null;
  }

  const filePath = `${vault}/project_${projectId}.md`;
  console.log('Obsidian attempting to read note from:', filePath);

  const result = await PluginAPI.executeNodeScript({
    script: `
      const fs = require('fs');
      if (fs.existsSync('${filePath}')) {
        const content = fs.readFileSync('${filePath}', 'utf-8');
        console.log('Obsidian successfully read note from:', '${filePath}');
        return content;
      }
      console.log('Obsidian note file not found at:', '${filePath}');
      return null;
    `,
  });

  return result.stdout;
};

PluginAPI.registerHook(PluginHooks.TASK_UPDATE, async (task: any) => {
  console.log('Obsidian Hook: TASK_UPDATE received for task:', task.id);

  const projectId = task.projectId;
  if (!projectId) {
    console.log('Obsidian Hook: No project ID found for task, skipping Obsidian note update.');
    return;
  }

  const allProjects = await PluginAPI.getAllProjects();
  const currentProject = allProjects.find((p) => p.id === projectId);

  if (!currentProject) {
    console.warn(`Obsidian Hook: Project with ID ${projectId} not found.`);
    return;
  }

  const obsidianNote = await readNote(projectId);
  console.log('Obsidian Hook: Current Obsidian note content:', obsidianNote ? '[content exists]' : '[empty]');
  console.log('Obsidian Hook: Current Super Productivity project notes:', currentProject.notes ? '[content exists]' : '[empty]');


  // If there's an obsidian note and it's different from the project's note in SP, update SP
  if (obsidianNote !== null && currentProject.notes !== obsidianNote) {
    console.log('Obsidian Hook: Updating Super Productivity project notes from Obsidian.');
    PluginAPI.updateProject(projectId, { notes: obsidianNote });
  }
  // If there's no obsidian note, but there are notes in SP, create an obsidian note
  else if (obsidianNote === null && currentProject.notes) {
    console.log('Obsidian Hook: Creating Obsidian note from Super Productivity project notes.');
    await writeNote(projectId, currentProject.notes);
  } else {
    console.log('Obsidian Hook: No change needed for notes synchronization.');
  }
});
