import { FileService } from './FileService';

export class CommandDispatcher {
  private commandMap: Record<string, Function>;
  private fileService: FileService;

  constructor() {
    this.fileService = new FileService();
    this.commandMap = {
      createNewFile: this.fileService.newFile,
      openFileDialog: this.fileService.openDialog,
      saveFile: this.fileService.save,
      find: this.fileService.find,
      // Add more commands here
    };
  }

  public async executeCommand(command: string, context: any): Promise<any> {
    const action = this.commandMap[command];
    if (action) {
      return await action(context);
    } else {
      throw new Error(`Command not found: ${command}`);
    }
  }
}
