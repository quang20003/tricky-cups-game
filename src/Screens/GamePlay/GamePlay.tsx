import React, { useState, useEffect } from "react";
import { View, ImageBackground, Image, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";

const GamePlay = () => {
  const navigation = useNavigation();
  const [ballPosition, setBallPosition] = useState(Math.floor(Math.random() * 3));
  const [selectedCup, setSelectedCup] = useState(null);
  const [shuffling, setShuffling] = useState(true);
  const [gameResult, setGameResult] = useState(null);
  const [showBall, setShowBall] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const cupAnimations = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)];
  const randomPositions = [0, 1, 2].sort(() => Math.random() - 0.5);
  useEffect(() => {
    if (shuffling) {
      const rotateAnimations = cupAnimations.map(anim =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 1000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 1000,
              easing: Easing.linear,
              useNativeDriver: true,
            })
          ])
        )
      );
      const translateXAnimations = cupAnimations.map((anim, index) =>
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ])
      );
      Animated.parallel([
        ...rotateAnimations,
        ...translateXAnimations
      ]).start(() => setAnimationFinished(true));
      const timer = setTimeout(() => {
        setShuffling(false);
      }, 3000);
      return () => {
        clearTimeout(timer);
        cupAnimations.forEach((anim) => anim.stopAnimation());
      };
    }
  }, [shuffling]);
  const handleCupPress = (index: number) => {
    if (animationFinished) {
      setSelectedCup(index);
      if (index === ballPosition) {
        setShowBall(true);
      }
      setTimeout(() => {
        if (index === ballPosition) {
          setGameResult('win');
        } else {
          setGameResult('lose');
        }
        setShowBall(false);
      }, 1000);
    }
  };
  const restartGame = () => {
    setBallPosition(Math.floor(Math.random() * 3));
    setSelectedCup(null);
    setShuffling(true);
    setShowBall(false);
    setGameResult(null);
    setAnimationFinished(false);
  };
  const rotateAnimation = cupAnimations.map(anim =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
  );

  const translateX = (index: number) => {
    const range = 200; 
    return cupAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, range]
    });
  };

  return (
    <ImageBackground source={require('../../Assets/images/background.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.cupsContainer}>
          {[0, 1, 2].map((cup, index) => (
            <TouchableOpacity key={index} onPress={() => handleCupPress(index)}>
              <Animated.Image
                source={require('../../Assets/images/plastic-cup.png')}
                style={[
                  styles.cup,
                  selectedCup === index && !shuffling && styles.selectedCup,
                  {
                    transform: [
                      { rotate: rotateAnimation[index] },
                      { translateX: translateX(index) }
                    ]
                  }
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {showBall && (
          <Image
            source={require('../../Assets/images/ball.png')}
            style={[styles.ball, { left: `${ballPosition * 33.33}%` }]}
          />
        )}

        {gameResult === 'win' && (
          <Image
            source={require('../../Assets/images/you-win.png')}
            style={styles.resultImage}
          />
        )}
        {gameResult === 'lose' && (
          <Image
            source={require('../../Assets/images/you-lose.png')}
            style={styles.resultImage}
          />
        )}

        {gameResult && (
          <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
            <Image
              source={require('../../Assets/images/tap-to-restart.png')}
              style={styles.restartImage}
            />
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

export default GamePlay;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cupsContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  cup: {
    width: 100,
    height: 150,
  },
  selectedCup: {
    transform: [{ scaleY: 1.2 }],
    top: -120,
  },
  ball: {
    position: "absolute",
    bottom: 325,
    width: 40,
    height: 40,
    marginLeft: 45
  },
  resultImage: {
    position: "absolute",
    top: 340,
    width: 349,
  },
  restartButton: {
    marginTop: 170,
  },
  restartImage: {
    width: 312,
    height: 36,
    top: 100,
  },
});
