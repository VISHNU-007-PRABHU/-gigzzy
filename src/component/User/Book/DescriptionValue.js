import React from 'react'
import { Icon,Modal,Alert } from 'antd';
import ImageGallery from 'react-image-gallery';
import { Alert_msg } from '../../Comman/alert_msg';

function DescriptionValue(props) {
    console.log(props);
    const [open, setOpen] = React.useState(false);
    let description = props.data;
    var data = description.split('#');
    var file=[];
    console.log(props);
    if(props.img){
        for(let i=0;i<props.img.length;i++){
            file.push({ original: props.img[i], thumbnail: props.img[i]});
        }
    }
  
    const open_img = () => {
        if(file.length>0){
            setOpen(true);
        }else{
            Alert_msg({msg:"User not upload any one file",status:"failed"})
        }
    }

    return (
        <div>
            {data.length > 0 ?
                data.map(value => {
                    if (value === "@image@") {
                        return <Icon type="camera" onClick={open_img} />
                    } else {
                        return value;
                    }
                })
                : <></>}

            <Modal title="Upload Your Image" footer={<></>} className="new_modal upload_img" centered visible={open}  onCancel={() =>{setOpen(false)} }>
                <div>
                     <ImageGallery items={file} lazyLoad={true} showPlayButton={false} />
                </div>
            </Modal>
        </div>

    )
}

export default DescriptionValue;
