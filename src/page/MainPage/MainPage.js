import React from 'react';
import './MainPage.styl';
import CollectData from 'page/CollectData/CollectData.js';
import ExcelUploadPage from 'page/ExcelUploadPage/ExcelUploadPage.js';
import FinishPage from 'page/FinishPage/FinishPage.js';
import ConfirmPage from 'page/ConfirmPage/ConfirmPage.js';

import { Steps,Button} from 'antd';
import { observer } from 'mobx-react';
import LicenseInfoStore from 'store/LicenseInfoStore.js'
const { Step } = Steps;
const licenseInfoStore=new LicenseInfoStore();

@observer
class MainPage extends React.Component {
  constructor(props) {
        super(props);
        //react state
        this.state={
          current: 0,
          maxCurrent:0
        }
    }

    nextStep(current){
      this.setState({ current:current,
      maxCurrent:current });
    };

    onChange(current){
      if(current<=this.state.maxCurrent && current!=this.state.current){
        this.setState({ current });
      }
    }

    getPageBycurrent(){
      let propsAttr={
        showMessage:this.props.showMessage,
        homePageStore:this.props.homePageStore,
        licenseInfoStore:licenseInfoStore
      };
      switch(this.state.current){
        case 0:return <CollectData {...propsAttr} nextStep={()=>this.nextStep(1)}></CollectData>
        case 1:return <ConfirmPage {...propsAttr} nextStep={()=>this.nextStep(2)}></ConfirmPage>
        case 2:return <ExcelUploadPage {...propsAttr} nextStep={()=>this.nextStep(3)}></ExcelUploadPage>
        case 3:return <FinishPage></FinishPage>
      }
    }

    getStepStatus(current){
      if(current<this.state.maxCurrent){
        return "finish"
      }else if(current===this.state.maxCurrent){
        return "process"
      }else{
        return "wait";
      }
    }

    render() {
        return (
            <div className="MainPage">
              <div className="step-content">
                  {this.getPageBycurrent()}
              </div>
              <div className="step-wrapper">
                <Steps           
                type="navigation"
            current={this.state.current}
            onChange={(current)=>{this.onChange(current)}}
            className="site-navigation-steps">
                  <Step status={this.getStepStatus(0)} title="Upload license file"  />
                  <Step status={this.getStepStatus(1)}  title="Confirm license file"  />
                  <Step status={this.getStepStatus(2)} title="Upload excel file"  />
                  <Step status={this.getStepStatus(3)}  title="Done"  />
                </Steps>    
              </div>          
          </div>
        );
    }
}

export default MainPage;