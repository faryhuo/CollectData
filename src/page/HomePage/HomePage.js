import React from 'react';
import 'page/HomePage/HomePage.styl';
import MenuList from 'component/Menu/Menu.js';
import MainPage from 'page/MainPage/MainPage.js';
import { Spin,Modal} from 'antd';
import HomePageStore from 'store/HomePageStore.js';
import { observer } from 'mobx-react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const homePageStore=new HomePageStore();
import 'antd/dist/antd.css';
@observer
class HomePage extends React.Component {
    constructor(props) {
        super(props);
        //react state
        this.state={

        }
    }

    destroyAll() {
        Modal.destroyAll();
    }
      
    showMessage(msg) {
        const { confirm } = Modal;
        let self=this;
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <div >{msg}</div>,
            onOk() {
                self.destroyAll()
            },
            onCancel() {
                self.destroyAll()
            },
        });       
      }
    

    render() {
        return (
            <div className="HomePage" >
                <div className="menu-wrapper">
                     <MenuList></MenuList>                    
                </div>
                <div className="contain-wrapper">
                    <MainPage showMessage={(e)=>{this.showMessage(e)}} homePageStore={homePageStore}></MainPage>
                </div>
                {homePageStore.loading && <div className="loading">                
                    <Spin size="large" tip="Loading..."></Spin>
                </div>}
            </div>
            
        );
    }
}

export default HomePage;