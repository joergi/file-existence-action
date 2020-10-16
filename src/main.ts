import * as core from '@actions/core'
import fs from 'fs'

export async function checkExistence(
  path: string,
  ignoreCase: boolean
): Promise<boolean> {
  try {
    if (ignoreCase) {
      await fs.promises.access(path.toLowerCase())
    } else {
      await fs.promises.access(path)
    }
  } catch (error) {
    return false
  }
  return true
}

async function run(): Promise<void> {
  try {
    const files: string = core.getInput('files', {required: true})
    const failure: boolean =
      (core.getInput('allow_failure') || 'false').toUpperCase() === 'TRUE'
    const ignoreCase: boolean =
        (core.getInput('ignore_case') || 'false').toUpperCase() === 'TRUE'
    const fileList: string[] = files
      .split(',')
      .map((item: string) => item.trim())
    const missingFiles: string[] = []

    // Check in parallel
    await Promise.all(
      fileList.map(async (file: string) => {
        const isPresent = await checkExistence(file, ignoreCase)
        if (!isPresent) {
          missingFiles.push(file)
        }
      })
    )

    if (missingFiles.length > 0) {
      if (failure) {
        core.setFailed(`These files doesn't exist: ${missingFiles.join(', ')}`)
      } else {
        core.info(`These files doesn't exist: ${missingFiles.join(', ')}`)
      }
      core.setOutput('files_exists', 'false')
    } else {
      core.info('🎉 All files exists')
      core.setOutput('files_exists', 'true')
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
