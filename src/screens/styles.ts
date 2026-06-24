import {
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  cardContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 55,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },

  /* ---------------- LOGO ---------------- */

  logoContainer: {
  width:'100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  marginTop: 14,
},

lineContainer: {
  marginRight: 4,
  marginTop: 36,
},

longLine: {
  width: 24,
  height: 1.5,
  marginBottom: 4,
},

shortLine: {
  width: 10,
  height: 1.5,
  marginLeft: 4,
},

logoText: {
  fontSize: 22,
  fontWeight: '700',
  color: '#000',
  lineHeight: 28,
  marginTop: 30,
},

birds: {
  width: 60,
  height: 50,
  position: 'absolute',
  top: -18,
  right: -10,
},

  /* ---------------- CENTER CONTENT ---------------- */

  image: {
    width: width * 0.82,
    height: height * 0.34,
    marginBottom: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 0,
  },

 subtitle: {
  fontSize: 16,
  color: '#7A7A7A',
  textAlign: 'center',
  marginTop: 10,
  fontWeight: '400',
},
  /* ---------------- PAGINATION ---------------- */

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    marginTop: 10,
  },

  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#000',
    marginHorizontal: 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },

  /* ---------------- BOTTOM SECTION ---------------- */

  bottomContainer: {
    width: '100%',
    marginBottom: 40,
  },

  button: {
    width: '100%',
    backgroundColor: '#000',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  browseText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 30,
  },

});

export default styles;