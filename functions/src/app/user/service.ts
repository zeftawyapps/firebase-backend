// import { User } from "../../data_moleds";
import { DepRepo } from "../main-data/dep/dep-repo";
import { ProfileRepo } from "./repo";
// import { userValidation } from "./validation";

export class ProfileService {
  prfileRepo: ProfileRepo;
  constructor() {
    this.prfileRepo = new ProfileRepo();
  }

  // setProfile
  async setProfile(uid: string, results: any) {
    const doc = await this.prfileRepo.getDocData(uid);

    let mony = doc.data().mony ?? 20;
    let scores = doc.data().scores ?? 0;
    let level = doc.data().level ?? 1;
    scores = scores + results.score;

    const depId = results.depId;
    const data = await new DepRepo().getDepsData(depId);

    console.log(data);
    const depMony = data?.mony;
    const newLevel = data?.sort;
    mony = mony - depMony;
    console.log(mony);
    if (newLevel > level) {
      level = newLevel;
    }
    //ser role of mony if score % 20 add 20 mony
    if (scores % 20 === 0) {
      mony = mony + 20;
    }

    await this.prfileRepo.setProfile(doc.id, results, { mony, scores, level });
  }

  async setMony(uid: string, mony: number) {
    const doc = await this.prfileRepo.getDocData(uid);

    let profmony = doc.data().mony ?? 20;
    profmony = profmony + mony;

    await this.prfileRepo.setMony(doc.id, profmony);
  }

  async createAccount(data: any) {
    // Save user to database
    const userId = await this.prfileRepo.createAccount(data);
    return { userId, ...data };
  }

  async login(data: any) {
    // const { error, value } = userValidation.login.validate(data);
    // if (error) throw error;
    // Get user by email
    // const userDoc = await this.prfileRepo.getUserByEmail(value.email);
    // const userData = userDoc.data();
    // TODO: Add password verification here
    // For now, just return success
    // Update login status
    //   await this.prfileRepo.updateLoginStatus(userData.uid, false);
    //   return {
    //     message: "Login successful",
    //     user: userData,
    //   };
  }
}
