import React from "react";
import {Text} from "react-native"

const AppText: React.FC<any> = (props) => {
  const {children} = props;
  return (
    <Text {...props}>
      {children}
    </Text>
  )
}

export default AppText;