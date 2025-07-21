import { CollectionsName } from "../../../constant/utils-consts/collection";
import { BadRequestException } from "../../../exception/bad-request.exception";
import { CatRepo } from "./cat-repo";

export class CatService {
  catRepo: CatRepo;
  constructor() {
    this.catRepo = new CatRepo();
  }
  async setcatSort(sort: number, catId: string) {
    const check = await this.checkOfcatSorts(sort);
    if (check) {
      throw new BadRequestException("يوجد قسم لديه نفس الترتيب");
    } else {
      await this.catRepo.update(CollectionsName.category, catId, { sort });
    }
  }

  async getcats() {
    return await this.catRepo.getcats();
  }

  async inset(data: any) {
    const cat = new CatRepo();
    await cat.insertData(data);
  }
  // update
  async update(docId: string, data: any) {
    const cat = new CatRepo();
    await cat.updateData(docId, data);
  }
  // delete
  async delete(docId: string) {
    const cat = new CatRepo();
    await cat.deleteData(docId);
  }

  async setcatMony(mony: number, catId: string) {
    await this.catRepo.update(CollectionsName.category, catId, { mony });
  }
  async createcatDoc(name: string) {
    const sorts = await this.catRepo.getcatsSorts();
    const catName: string = name;
    //sort the array
    sorts.sort();
    const sortLast = sorts[sorts.length - 1];
    const sort = sortLast + 1;
    this.catRepo.insert(CollectionsName.category, { sort, catName });
  }
  async checkOfcatSorts(sort: number) {
    const sorts = await this.catRepo.getcatsSorts();
    return sorts.includes(sort);
  }
  async checkOfcatQustionsCount(catId: string) {
    const quiz = await this.catRepo.getcatsQuistions(catId);
    return quiz.length;
  }
  async setcatPublish(isPublish: boolean, catId: string) {
    if (!isPublish) {
      await this.catRepo.update(CollectionsName.category, catId, {
        isPublish,
      });
    } else {
      const checkCount = await this.checkOfcatQustionsCount(catId);
      if (checkCount < 30) {
        throw new BadRequestException(
          "يجب ان لا يقل عدد الاسئلة عن 30 سؤال حتى يتم النشر"
        );
      } else {
        await this.catRepo.update(CollectionsName.category, catId, {
          isPublish,
        });
      }
    }
  }
}
