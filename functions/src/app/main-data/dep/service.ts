import { CollectionsName } from "../../../constant/utils-consts/collection";
import { BadRequestException } from "../../../exception/bad-request.exception";
import { DepRepo } from "./dep-repo";

export class DepService {
  depRepo: DepRepo;
  constructor() {
    this.depRepo = new DepRepo();
  }
  async setDepSort(sort: number, depId: string) {
    const check = await this.checkOfDepSorts(sort);
    if (check) {
      throw new BadRequestException("يوجد قسم لديه نفس الترتيب");
    } else {
      await this.depRepo.update(CollectionsName.department, depId, { sort });
    }
  }

  async setDepMony(mony: number, depId: string) {
    await this.depRepo.update(CollectionsName.department, depId, { mony });
  }
  async createDepDoc(name: string) {
    const sorts = await this.depRepo.getDepsSorts();
    const depName: string = name;
    //sort the array
    sorts.sort();
    const sortLast = sorts[sorts.length - 1];
    const sort = sortLast + 1;
    this.depRepo.insert(CollectionsName.department, { sort, depName });
  }
  async checkOfDepSorts(sort: number) {
    const sorts = await this.depRepo.getDepsSorts();
    return sorts.includes(sort);
  }
  async checkOfDepQustionsCount(depId: string) {
    const quiz = await this.depRepo.getDepsQuistions(depId);
    return quiz.length;
  }
  async setDepPublish(isPublish: boolean, depId: string) {
    if (!isPublish) {
      await this.depRepo.update(CollectionsName.department, depId, {
        isPublish,
      });
    } else {
      const checkCount = await this.checkOfDepQustionsCount(depId);
      if (checkCount < 30) {
        throw new BadRequestException(
          "يجب ان لا يقل عدد الاسئلة عن 30 سؤال حتى يتم النشر"
        );
      } else {
        await this.depRepo.update(CollectionsName.department, depId, {
          isPublish,
        });
      }
    }
  }
  async resortDeps() {
    const data = await this.depRepo.getDeps();
    let i = 0;
    const length = data.docs.length;
    for (i = 0; i < data.docs.length; i++) {
      const dep = data.docs[i];
      const depId = dep.id;
      const sort = i + 1 + length;

      const quizCount = await this.depRepo.getDepsQuistions(depId);
      const leng = quizCount.length;
      let isPublish = false;
      if (leng >= 30) {
        isPublish = true;
      } else {
        isPublish = false;
      }

      const mony = 20;
      await this.depRepo.update(CollectionsName.department, depId, {
        sort,
        isPublish,
        mony,
      });
    }
  }
}
