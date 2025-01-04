import { View, StyleSheet, Animated, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Icon } from '@rneui/themed';
import React from 'react';
const OrderSuccessMessage = () => {
  const [circleAnim] = useState(new Animated.Value(0));
  const [checkmarkAnim] = useState(new Animated.Value(0));

  useEffect(() => {
      Animated.timing(circleAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }).start();
      Animated.timing(checkmarkAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }).start();
  }, [circleAnim, checkmarkAnim]);

  const circleScale = circleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const checkmarkOpacity = checkmarkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: circleScale }],
          },
        ]}
      />
      <Animated.View style={{ opacity: checkmarkOpacity }}>
        <Icon
          name="check-circle"
          type="font-awesome"
          color="#4caf50"
          size={80}
        />
      </Animated.View>
      <Text style={styles.successText}>Order Placed Successfully!</Text>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      position:"absolute",
      top: 0,
      bottom:0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
    },
    circle: {
      position: 'absolute',
      width: 370,
      height: 370,
      borderRadius: 250,
      backgroundColor: '#e8f5e9',
    },
    successText: {
      marginTop: 20,
      fontSize: 20,
      fontWeight: 'bold',
      color: '#4caf50',
    },
  });


export default OrderSuccessMessage;
// import { View, StyleSheet, Animated, Text } from 'react-native';
// import { useState, useEffect } from 'react';
// import { Icon } from '@rneui/themed';
// import React from 'react';

// const OrderSuccessMessage = () => {
//   const [circleAnim] = useState(new Animated.Value(0));
//   const [checkmarkAnim] = useState(new Animated.Value(0));

//   useEffect(() => {
//     // Animate the circle first
//     Animated.sequence([
//       Animated.timing(circleAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       // Animate the checkmark after the circle
//       Animated.timing(checkmarkAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, [circleAnim, checkmarkAnim]);

//   const circleScale = circleAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 1.5],
//   });

//   const checkmarkOpacity = checkmarkAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 1],
//   });

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[
//           styles.circle,
//           {
//             transform: [{ scale: circleScale }],
//           },
//         ]}
//       />
//       <Animated.View style={{ opacity: checkmarkOpacity }}>
//         <Icon
//           name="check-circle"
//           type="font-awesome"
//           color="#4caf50"
//           size={80}
//         />
//       </Animated.View>
//       <Text style={styles.successText}>Order Placed Successfully!</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // backgroundColor: '#FFFFFF',
//   },
//   circle: {
//     position: 'absolute',
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     backgroundColor: '#e8f5e9',
//   },
//   successText: {
//     marginTop: 20,
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#ffffff',
//   },
// });

// export default OrderSuccessMessage;