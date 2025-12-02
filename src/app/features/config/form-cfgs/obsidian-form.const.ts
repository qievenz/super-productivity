import { T } from '../../../t.const';
import { ConfigFormSection, ObsidianConfig } from '../global-config.model';

export const OBSIDIAN_FORM_CFG: ConfigFormSection<ObsidianConfig> = {
  title: 'Obsidian',
  key: 'obsidian',
  help: T.F.OBSIDIAN.HELP,
  items: [
    {
      key: 'isEnabled',
      type: 'toggle',
      templateOptions: {
        label: T.F.OBSIDIAN.IS_ENABLED,
      },
    },
    {
      key: 'vaultName',
      type: 'input',
      templateOptions: {
        label: T.F.OBSIDIAN.VAULT_NAME,
        required: true,
      },
      hideExpression: '!model.isEnabled',
    },
  ],
};
