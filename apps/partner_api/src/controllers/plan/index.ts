import { injectable } from 'tsyringe';
import { listPlan } from './methods/listPlan';
import { viewPlan } from './methods/viewPlan';

@injectable()
class PlanController {
  public list = listPlan;
  public view = viewPlan;
}

export default PlanController;
