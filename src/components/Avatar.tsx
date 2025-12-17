import { Image} from 'react-native'
import React from 'react'


type Props = {
    avatar?: string,
    width?: number | string,
    height?: number | string,
}
const Avatar : React.FC<Props> = ({avatar, width, height}) => {
    console.log('avatar : ', avatar);
    return (
        <Image
            source={{ uri: avatar}}
            className={`rounded-full ${width ? '' : 'w-12'} ${height ? '' : 'h-12'}`}
            resizeMethod='resize'
            resizeMode='cover'
        />
    )
}

export default Avatar
