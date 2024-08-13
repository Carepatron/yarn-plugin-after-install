import { Plugin, Project, InstallMode } from '@yarnpkg/core'
import type { InstallOptions } from '@yarnpkg/core/lib/Project'
import { configuration } from './config'
import { AfterInstallCommand } from './commands/afterInstall'
import { executeAfterInstallHook } from './utils'
import 'dotenv/config'

const isCI = process.env.CI === 'true'

const plugin: Plugin = {
  configuration,
  commands: [AfterInstallCommand],
  hooks: {
    afterAllInstalled: async (project: Project, options?: InstallOptions): Promise<void> => {
      // Skip the hook if we're in CI or the mode is `update-lockfile`
      if (options?.mode === InstallMode.UpdateLockfile || isCI) {
        console.log('Skipping `afterInstall` hook because we are in CI or the mode is `update-lockfile`')
        return
      }

      const exitCode = await executeAfterInstallHook(project.configuration, true)
      if (exitCode) {
        throw new Error('The `afterInstall` hook failed, see output above.')
      }
    }
  }
}

export default plugin
