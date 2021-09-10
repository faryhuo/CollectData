import {observable, action, useStrict} from 'mobx';

class HomePageStore {
  @observable loading=false;

  @action showLoading(){
    this.loading=true;
  }

  @action closeLoading(){
    this.loading=false;
  }
}
export default HomePageStore;