import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

const ProductCategoryTabs = ({
  selectedCategory,
  onSelectCategory,
}: Props) => {

  const categories = [
    'Milk',
    'Chicken',
    'Ghee',
  ];

  return (

    <View style={styles.container}>

      {categories.map(category => {

        const isSelected =
          selectedCategory === category;

        return (

          <TouchableOpacity
            key={category}
           style={[
  styles.tab,
  isSelected &&
    (category === 'Milk'
      ? styles.milkActiveTab
      : styles.activeTab),
]}
            onPress={() =>
              onSelectCategory(category)
            }
          >

            <Text
              style={[
                styles.tabText,
                isSelected &&
                  styles.activeTabText,
              ]}
            >
              {category}
            </Text>

          </TouchableOpacity>

        );

      })}

    </View>

  );

};

export default ProductCategoryTabs;

const styles = StyleSheet.create({

container: {
  flexDirection: 'row',
  marginTop: 12,
  marginBottom: 18,

  backgroundColor: '#FFFFFF',

  borderWidth: 1,
  borderColor: '#E3E3E3',

  borderRadius: 12,

  padding: 0,   // important
},

  tab: {
  flex: 1,

  height: 44,

  justifyContent: 'center',
  alignItems: 'center',

  borderRadius: 10,
},

 activeTab: {
  backgroundColor: '#000',
},

tabText: {
  fontSize: 12,
  fontWeight: '500',
  color: '#000',
},

 activeTabText: {
  color: '#FFF',
  fontWeight: '600',
},
milkActiveTab: {
  backgroundColor: '#5C9D61',
},
});