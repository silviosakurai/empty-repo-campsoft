import { injectable } from 'tsyringe';
import { listPlan } from './methods/listPlan';
import { viewPlan } from './methods/viewPlan';
import { postPlan } from './methods/postPlan';

@injectable()
class PlanController {
  public list = listPlan;
  public view = viewPlan;
  public create = postPlan;
}

export default PlanController;
