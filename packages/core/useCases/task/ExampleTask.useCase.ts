import { AsyncTask } from "toad-scheduler";

class ExampleTaskUseCase {
  task() {
    return new AsyncTask(
      "simple task",
      (taskId?: string, jobId?: string) => {
        console.log("rodando");
        return new Promise(() => {
          return void 0;
        });
      },
      (err) => {
        /* handle errors here */
      }
    );
  }
}

export const exampleTaskUseCase = new ExampleTaskUseCase();
