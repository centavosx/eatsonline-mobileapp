import React from 'react'
import categories from '../Components/Categories';
const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
const ListCategories = () => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}>
            {categories.map((category, index) => (
                <TouchableOpacity key={index} activeOpacity={0.8}>
                    <View style={{
                        backgroundColor: selectedCategoryIndex == index
                            ? 'orange'
                            : 'red',
                        ...styles.categoryBtn,
                    }}></View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
};
export default ListCategories;

const styles = StyleSheet.create({
    contentContainerStyle: {
        paddingVertical: 30,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    categoryBtn: {
        height: 45,
        width: 120,
        marginRight: 7,
        borderRadius: 30,
        alignItems: 'center',
        paddingHorizontal: 5,
        flexDirection: 'row',
    },
});
