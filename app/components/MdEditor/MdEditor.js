import React, {useContext} from 'react'
import MDEditor, { EditorContext } from '@uiw/react-md-editor';
import { Controller } from 'react-hook-form';
import styles from './MdEditor.module.css'

const EditBtn = () => {
  const { dispatch } = useContext(EditorContext);
  const click = () => {
    dispatch({
      preview: "edit"
    });
  };
  return <button type='button' onClick={click}>編輯</button>
}
const PreviewBtn = () => {
  const { dispatch } = useContext(EditorContext);
  const click = () => {
    dispatch({
      preview: "preview"
    });
  };
  return <button type='button' onClick={click}>預覽</button>
}

const codeEdit = {
  name: "edit",
  keyCommand: "edit",
  value: "edit",
  icon: <EditBtn />
};
const codePreview = {
  name: "preview",
  keyCommand: "preview",
  value: "preview",
  icon: <PreviewBtn />
};

const MdEditor = ({control, errors}) => {
  return (
    <div>
      <Controller
        control={control}
        name="body"
        rules={{
          minLength: {
            value: 30,
            message: '文章至少需30字'
          },
        }}
        render={({ field: { onChange, value = "" } }) => (
          <MDEditor
            textareaProps={{
              placeholder: "請輸入內文"
            }}
            height={300}
            value={value}
            onChange={onChange}
            preview="edit"
            extraCommands={[codeEdit, codePreview]}
          />
        )}
      />
      {errors.body && <p className={styles.errorHint}>{errors.body.message}</p>}
    </div>
  )
}

export default MdEditor