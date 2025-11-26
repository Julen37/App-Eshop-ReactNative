import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AntDesign, Feather } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

interface RatingProps {
    rating:number;
    count?:number;
    size?:number;
    showCount?:boolean;
}

const Rating:React.FC<RatingProps> = ({
    rating, count, 
    size=16, showCount=true
}) => {

    const roundedRating = Math.round(rating * 2) / 2;
    const renderStars = () => {
        const stars = [];
        // full star
        for (let i = 1; i <= Math.floor(roundedRating); i++) {
            stars.push(
                <AntDesign
                    name='star'
                    key={`star-${i}`}
                    size={size}
                    color={AppColors.accent[500]}
                    fill={AppColors.accent[500]}
                />
            )
        };
        // empty stars
        const emptyStars = 5 - Math.floor(roundedRating);
        for (let i = 1; i <= emptyStars; i++) {
            stars.push(
                <Feather
                    name='star'
                    size={size}
                    color={AppColors.accent[500]}
                    style={styles.halfStarforeground}
                />
            )
        };

        return stars;
    }

  return (
    <View style={styles.container}>
        <View style={styles.starsContainer}>
            {renderStars()}
        </View>
    </View>
  )
}

export default Rating

const styles = StyleSheet.create({
    halfStarforeground : {
        // position: "absolute"
    },
    halfStarOverlay : {
        position: "absolute",
        width: "50%",
        overflow: "hidden"
    },
    halfStarBackground : {
        // position: "absolute",
    },
    halfStarContainer : {
        position: "relative",
    },
    count : {
        marginLeft: 4,
        fontSize: 14,
        color: AppColors.text.secondary,
    },
    starsContainer : {
        flexDirection: 'row',
        alignItems: "center",
    },
    container : {
        flexDirection: 'row',
        alignItems: "center",
    }
})