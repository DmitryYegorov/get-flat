import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { MdUploadFile } from 'react-icons/md';
import { indigo, purple } from '@mui/material/colors';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@get-flat/app/firebase';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(indigo[500]),
    backgroundColor: indigo[500],
    '&:hover': {
      backgroundColor: indigo[700],
    },
  }));

interface Props {
    path: string;
    onLoad: (list: string[]) => void;
}

export default function InputFileUpload({
    path,
    onLoad,
}: Props) {

    const [list, setImages] = React.useState<string[]>([]);

    const uploadToFirebase = async (images) => {
        const urls = [];
        for await (const image of images) {
            const imageRef = ref(storage, `${path}/${image.name}`);
            const uploaded = await uploadBytes(imageRef, image);

            const url = await getDownloadURL(uploaded.ref);
            console.log(url);
            urls.push(url);
        }

        onLoad(urls);
    };

    return (
        <StyledButton
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<MdUploadFile />}
        >
            Загрузить ещё
            <VisuallyHiddenInput type="file" multiple onChange={(e) => {
                uploadToFirebase(e.target.files);
            }}/>
        </StyledButton>
    );
}