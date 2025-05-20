import { MembershipPlanModel } from "../../database";

export class MembershipService {
    constructor() {}

    /**
     * Permite obtener los planes de membresía
     * @description Este método permite obtener los planes de membresía
     * @returns 
     */
    async getMembershipPlans() {
        try {
            const membershipPlans = await MembershipPlanModel.find();
            return membershipPlans;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}