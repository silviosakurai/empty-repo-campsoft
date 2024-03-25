import { injectable } from 'tsyringe';
import { listPlan } from './methods/listPlan';
import { viewPlan } from './methods/viewPlan';
import { upgradePlan } from './methods/upgradePlan';

@injectable()
class PlanController {
  public list = listPlan;
  public view = viewPlan;
  public upgrade = upgradePlan;
}

export default PlanController;
