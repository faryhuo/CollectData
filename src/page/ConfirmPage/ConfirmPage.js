import React from 'react';
import { Upload, Button,Modal} from 'antd';
import {
  ConfigProvider,
  Transfer,

} from 'antd';
import './ConfirmPage.styl';

class ConfirmPage extends React.Component {
  constructor(props) {
        super(props);
        //react state
        this.state={
          dataSource:[]
        }
    }


    render() {
        return (
            <div className="ConfirmPage">
                <div>
                  <h1>Confrim need upload file</h1>
                </div>
                <div>
                <ConfigProvider>
                <Transfer
                  listStyle={{
                    width: 400,
                    height: 400,
                  }}
                  dataSource={this.state.dataSource}
                  titles={['Upload file', 'Duplicate file']}
                  render={item => item.title}
                />
                </ConfigProvider>
                </div>
                <div  className="action-button">
                    <Button type="primary" onClick={()=>{this.props.nextStep()}}>Next</Button>
                </div>
          </div>
        );
    }
}

export default ConfirmPage;