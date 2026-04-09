/**
 * File: assets/styles/styles.ts
 * Author: (cmcfar)/cmcfar@bu.edu
 * Description: React Native stylesheet that mirrors the CSS styling from the
 * mini_insta Django web app. Designed to be responsive across phone and iPad.
 * CONVERSATION USED TO GENERATE STYLING FOR THIS FILE: https://claude.ai/share/9cd36580-8d68-40fd-88e0-dbbae15d1ab0
 * Usage:
 *   import S from '@/assets/styles/styles';
 *   // Then use S.container, S.title, etc.
 *
 * Color Palette:
 *   Primary purple:   #A882DD
 *   Light purple:     #bc9ee6
 *   Dark background:  #000000
 *   Card background:  #302f2f
 *   Border/dim text:  #333333 / rgb(140,137,137)
 *   Accent yellow:    #FFCD7B
 *   Accent red:       #C8154B
 *   Accent blue:      #6698CC
 */

import { StyleSheet, Dimensions, Platform } from 'react-native';

// ---------------------------------------------------------------------------
// RESPONSIVE HELPERS
// ---------------------------------------------------------------------------
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/** True when running on a device wider than 600 px (iPad / large phone landscape). */
export const isTablet = SCREEN_W >= 600;

/** Clamp a value between a min and max. */
const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

/** Scale a "base phone" px value proportionally to the current screen width.
 *  Capped so values don't explode on iPads. */
const rs = (px: number) => clamp((SCREEN_W / 390) * px, px * 0.75, px * 1.6);

// ---------------------------------------------------------------------------
// DESIGN TOKENS (mirrors CSS custom props / recurring values)
// ---------------------------------------------------------------------------
export const Colors = {
  bg: '#000000',
  cardBg: '#302f2f',
  border: '#333333',
  borderLight: '#ccc',
  primary: '#A882DD',
  primaryLight: '#bc9ee6',
  dimText: 'rgb(140,137,137)',
  white: '#ffffff',
  textDark: '#302f2f',
  errorRed: '#C8154B',
  likeRed: '#C8154B',
  saveYellow: '#FFCD7B',
  commentBlue: '#6698CC',
  postInfoBg: '#ffffff',
};

// ---------------------------------------------------------------------------
// MAIN STYLESHEET
// ---------------------------------------------------------------------------
const S = StyleSheet.create({

  // ── GLOBAL / SHARED ──────────────────────────────────────────────────────

  /** Full-screen black background, white text */
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  /** Safe-area wrapper with standard padding */
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: rs(20),
    paddingTop: Platform.OS === 'android' ? rs(40) : rs(20),
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },

  loadingText: {
    marginTop: rs(10),
    color: Colors.white,
    fontSize: rs(14),
  },

  errorText: {
    color: Colors.errorRed,
    textAlign: 'center',
    marginBottom: rs(15),
    fontSize: rs(13),
  },

  divider: {
    width: '100%',
    maxWidth: rs(400),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.dimText,
    marginVertical: rs(20),
    alignSelf: 'center',
  },

  // ── TYPOGRAPHY ────────────────────────────────────────────────────────────

  /** Big page / section title */
  pageTitle: {
    fontSize: rs(28),
    fontWeight: '800',
    fontStyle: 'italic',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: rs(20),
  },

  sectionTitle: {
    fontSize: rs(20),
    fontWeight: '700',
    color: Colors.white,
    marginBottom: rs(12),
  },

  bodyText: {
    fontSize: rs(14),
    color: Colors.white,
    lineHeight: rs(20),
  },

  dimText: {
    fontSize: rs(14),
    color: Colors.dimText,
  },

  // ── NAV / HEADER ─────────────────────────────────────────────────────────

  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rs(20),
    paddingVertical: rs(12),
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  navBrand: {
    fontSize: rs(22),
    fontWeight: '800',
    fontStyle: 'italic',
    color: Colors.primary,
  },

  navLink: {
    color: Colors.dimText,
    fontSize: rs(14),
    marginLeft: rs(20),
  },

  // ── FEED ─────────────────────────────────────────────────────────────────

  feedWrapper: {
    width: '100%',
    maxWidth: isTablet ? 600 : undefined,
    alignSelf: 'center',
    paddingTop: rs(20),
  },

  // ── PROFILE CARD (feed cards) ─────────────────────────────────────────────

  profileCard: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: rs(8),
    overflow: 'hidden',
    marginBottom: rs(28),
    backgroundColor: Colors.bg,
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rs(12),
  },

  profileHeaderAvatar: {
    width: rs(52),
    height: rs(52),
    borderRadius: rs(26),
    borderWidth: 0.3,
    borderColor: 'gray',
  },

  profileHeaderName: {
    marginLeft: rs(14),
    fontSize: rs(16),
    fontWeight: '600',
    color: Colors.white,
  },

  postImage: {
    width: '100%',
    aspectRatio: 1,          // square by default; override to 4/3 if needed
    resizeMode: 'cover',
    maxHeight: rs(600),
  },

  cardCaption: {
    padding: rs(10),
    fontSize: rs(14),
    color: Colors.white,
    textAlign: 'left',
  },

  // ── ENGAGEMENT BUTTONS ────────────────────────────────────────────────────

  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(15),
    padding: rs(10),
  },

  engagementBtn: {
    padding: rs(8),
  },

  // ── ACTIVITY / STORY ROW ─────────────────────────────────────────────────

  /** Horizontal scroll container for activity cards */
  scrollRow: {
    paddingVertical: rs(20),
    paddingHorizontal: rs(10),
  },

  activityCard: {
    width: rs(160),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: rs(20),
    padding: rs(10),
    alignItems: 'center',
    marginRight: rs(12),
    backgroundColor: Colors.bg,
  },

  activityAvatar: {
    width: rs(72),
    height: rs(72),
    borderRadius: rs(36),
    borderWidth: 0.3,
    borderColor: 'gray',
    marginBottom: rs(8),
  },

  activityName: {
    fontSize: rs(14),
    color: Colors.white,
    textAlign: 'center',
    marginBottom: rs(8),
    flexWrap: 'wrap',
  },

  // ── FOLLOW BUTTON ─────────────────────────────────────────────────────────

  followBtn: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: rs(5),
    paddingVertical: rs(5),
    paddingHorizontal: rs(14),
  },

  followBtnText: {
    color: Colors.white,
    fontSize: rs(13),
  },

  followBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: rs(5),
    paddingVertical: rs(5),
    paddingHorizontal: rs(14),
  },

  followBtnOutlineText: {
    color: Colors.primary,
    fontSize: rs(13),
  },

  // ── PROFILE PAGE ─────────────────────────────────────────────────────────

  profilePageWrapper: {
    alignItems: 'center',
    paddingTop: rs(40),
    paddingHorizontal: rs(20),
  },

  profilePageAvatar: {
    width: isTablet ? rs(160) : rs(120),
    height: isTablet ? rs(160) : rs(120),
    borderRadius: isTablet ? rs(80) : rs(60),
    borderWidth: 0.3,
    borderColor: 'gray',
  },

  profilePageUsername: {
    marginTop: rs(12),
    fontSize: isTablet ? rs(32) : rs(24),
    fontWeight: '800',
    color: Colors.white,
  },

  profileHeaderInfo: {
    alignItems: 'center',
    marginTop: rs(16),
    width: '100%',
  },

  aboutMeTitle: {
    fontSize: rs(20),
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },

  bioText: {
    marginTop: rs(10),
    fontSize: rs(14),
    color: Colors.dimText,
    textAlign: 'justify',
    maxWidth: rs(400),
    lineHeight: rs(20),
  },

  // ── PROFILE METRICS (posts / followers / following) ───────────────────────

  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rs(8),
    marginTop: rs(8),
  },

  metricItem: {
    paddingHorizontal: rs(20),
    alignItems: 'center',
  },

  metricItemBordered: {
    paddingHorizontal: rs(20),
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.dimText,
  },

  metricCount: {
    fontSize: rs(18),
    fontWeight: '700',
    color: Colors.white,
  },

  metricLabel: {
    fontSize: rs(12),
    color: Colors.dimText,
  },

  // ── EDIT PROFILE BUTTON ───────────────────────────────────────────────────

  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(8),
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: rs(8),
    paddingVertical: rs(10),
    paddingHorizontal: rs(14),
    marginBottom: rs(16),
  },

  editProfileBtnText: {
    color: Colors.white,
    fontSize: rs(14),
  },

  headerEditLinks: {
    flexDirection: 'row',
    gap: rs(12),
    marginBottom: rs(16),
  },

  // ── PROFILE POSTS GRID ────────────────────────────────────────────────────

  /** 3-column grid for profile thumbnails */
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rs(3),
    paddingTop: rs(20),
    width: '100%',
    maxWidth: isTablet ? 935 : undefined,
    alignSelf: 'center',
  },

  postThumb: {
    width: (SCREEN_W - rs(3) * 2) / 3,  // 3 cols with 2 gutters
    aspectRatio: 1,
    backgroundColor: '#aeadad',
    overflow: 'hidden',
  },

  postThumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // ── POST VIEW (detail) ────────────────────────────────────────────────────

  /** Wraps the image + info panels */
  postViewWrapper: {
    width: '100%',
    maxWidth: isTablet ? 935 : undefined,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: rs(12),
    overflow: 'hidden',
    // Shadow
    shadowColor: Colors.primary,
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },

  postDetailImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
    backgroundColor: '#111',
  },

  postInfoPanel: {
    backgroundColor: Colors.postInfoBg,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },

  postInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: rs(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  postInfoAvatarSmall: {
    width: rs(42),
    height: rs(42),
    borderRadius: rs(21),
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  postInfoUsername: {
    marginLeft: rs(10),
    fontSize: rs(14),
    fontWeight: '600',
    color: Colors.textDark,
  },

  postCaption: {
    padding: rs(12),
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  postCaptionText: {
    fontSize: rs(13),
    color: Colors.textDark,
    lineHeight: rs(20),
  },

  likedByText: {
    padding: rs(12),
    fontSize: rs(13),
    color: Colors.textDark,
  },

  // ── COMMENTS ─────────────────────────────────────────────────────────────

  commentSection: {
    paddingHorizontal: rs(12),
    paddingVertical: rs(8),
    maxHeight: rs(280),
  },

  commentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: rs(8),
    padding: rs(8),
    backgroundColor: '#f5f5f5',
    borderRadius: rs(10),
    marginBottom: rs(6),
  },

  commentAvatar: {
    width: rs(32),
    height: rs(32),
    borderRadius: rs(16),
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  commentUsername: {
    fontSize: rs(12),
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: rs(2),
  },

  commentText: {
    fontSize: rs(13),
    color: '#555',
    lineHeight: rs(18),
  },

  noComments: {
    fontSize: rs(13),
    color: Colors.dimText,
    textAlign: 'center',
    paddingVertical: rs(16),
  },

  // ── CREATE POST ───────────────────────────────────────────────────────────

  createPostWrapper: {
    flex: 1,
    padding: rs(20),
    backgroundColor: Colors.bg,
  },

  createPostTitle: {
    fontSize: rs(28),
    fontWeight: '800',
    fontStyle: 'italic',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: rs(20),
  },

  createPostInput: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: rs(8),
    color: Colors.white,
    paddingHorizontal: rs(12),
    paddingVertical: rs(10),
    fontSize: rs(14),
    marginBottom: rs(14),
    width: '100%',
  },

  createPostInputFocused: {
    borderColor: Colors.primary,
    // Note: box-shadow equivalent via elevation on Android, shadow* on iOS
    shadowColor: Colors.primary,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
    elevation: 4,
  },

  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: rs(20),
  },

  pickedImage: {
    width: isTablet ? rs(400) : rs(300),
    height: isTablet ? rs(300) : rs(225),
    marginTop: rs(14),
    borderRadius: rs(8),
  },

  imageSectionLabel: {
    marginTop: rs(24),
    fontSize: rs(22),
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: rs(8),
  },

  buttonRow: {
    flexDirection: 'row',
    gap: rs(12),
    marginTop: rs(16),
  },

  btnPost: {
    flex: 1,
    paddingVertical: rs(10),
    paddingHorizontal: rs(16),
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: rs(8),
    alignItems: 'center',
  },

  btnPostText: {
    color: Colors.white,
    fontSize: rs(14),
    fontWeight: '600',
  },

  btnCancel: {
    flex: 1,
    paddingVertical: rs(10),
    paddingHorizontal: rs(16),
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: rs(8),
    alignItems: 'center',
  },

  btnCancelText: {
    color: Colors.dimText,
    fontSize: rs(14),
  },

  // ── SEARCH ────────────────────────────────────────────────────────────────

  searchWrapper: {
    alignItems: 'center',
    width: '100%',
    maxWidth: isTablet ? 600 : undefined,
    alignSelf: 'center',
    paddingTop: rs(20),
  },

  searchForm: {
    flexDirection: 'row',
    gap: rs(10),
    width: '100%',
  },

  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: rs(8),
    paddingHorizontal: rs(10),
    paddingVertical: rs(8),
  },

  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: Colors.white,
    fontSize: rs(14),
    marginLeft: rs(6),
  },

  searchBtn: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: rs(8),
    paddingVertical: rs(10),
    paddingHorizontal: rs(16),
    justifyContent: 'center',
  },

  searchBtnText: {
    color: Colors.white,
    fontSize: rs(14),
    whiteSpace: 'nowrap',
  } as any,

  searchSectionTitle: {
    paddingTop: rs(16),
    fontSize: rs(16),
    color: Colors.white,
    fontWeight: '700',
  },

  // ── FOLLOW LIST (followers / following pages) ─────────────────────────────

  followWrapper: {
    alignItems: 'center',
    paddingHorizontal: rs(20),
    maxWidth: isTablet ? 600 : undefined,
    alignSelf: 'center',
    width: '100%',
  },

  followPageTitle: {
    marginBottom: rs(16),
    color: Colors.primary,
    fontSize: rs(28),
    fontWeight: '800',
  },

  followList: {
    width: '100%',
    gap: rs(6),
  },

  followCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rs(14),
    paddingVertical: rs(10),
    borderRadius: rs(8),
    marginBottom: rs(6),
  },

  followCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(12),
    flex: 1,
  },

  followAvatar: {
    width: rs(48),
    height: rs(48),
    borderRadius: rs(24),
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  followName: {
    fontSize: rs(14),
    fontWeight: '600',
    color: Colors.white,
  },

  followSubtext: {
    fontSize: rs(12),
    color: Colors.dimText,
  },

  // ── LOGIN / REGISTER ──────────────────────────────────────────────────────

  authContainer: {
    flex: 1,
    backgroundColor: Colors.postInfoBg,
    padding: rs(20),
    justifyContent: 'center',
  },

  fieldWrapper: {
    marginBottom: rs(14),
  },

  fieldLabel: {
    fontSize: rs(13),
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: rs(4),
  },

  fieldInput: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: rs(6),
    paddingHorizontal: rs(10),
    paddingVertical: rs(8),
    fontSize: rs(14),
    color: '#000',
  },

  helpText: {
    color: '#888',
    fontSize: rs(11),
    marginTop: rs(2),
  },

  fieldError: {
    color: 'red',
    fontSize: rs(11),
    marginTop: rs(2),
  },

  registerBanner: {
    paddingTop: rs(16),
    color: Colors.textDark,
    textAlign: 'center',
    fontSize: rs(13),
  },

  registerLink: {
    color: Colors.primary,
    fontSize: rs(13),
  },

  btnRegister: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: rs(8),
    paddingVertical: rs(12),
    alignItems: 'center',
    marginTop: rs(8),
    width: '100%',
  },

  btnRegisterText: {
    color: Colors.white,
    fontSize: rs(15),
    fontWeight: '600',
  },

  // ── STICKY FAB / BOTTOM TAB ────────────────────────────────────────────────

  fab: {
    position: 'absolute',
    bottom: rs(16),
    alignSelf: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: rs(30),
    paddingHorizontal: rs(28),
    paddingVertical: rs(6),
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(16),
    zIndex: 1000,
    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },

  fabIcon: {
    width: rs(52),
    height: rs(52),
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabAvatar: {
    width: rs(44),
    height: rs(44),
    borderRadius: rs(22),
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  // ── FOOTER ────────────────────────────────────────────────────────────────

  footer: {
    margin: rs(20),
    padding: rs(20),
    backgroundColor: Colors.cardBg,
    borderRadius: rs(10),
  },

  footerBrand: {
    fontSize: rs(52),
    fontWeight: '800',
    fontStyle: 'italic',
    color: Colors.primary,
  },

  footerCopy: {
    color: '#ccc',
    fontSize: rs(13),
    marginTop: rs(4),
  },

  footerLinkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rs(20),
    marginBottom: rs(16),
    marginTop: rs(12),
  },

  footerLink: {
    color: '#ccc',
    fontSize: rs(13),
    textDecorationLine: 'none',
  },

  // ── FORM CONTROLS ─────────────────────────────────────────────────────────

  /** Generic outlined input, dark theme */
  darkInput: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: rs(8),
    color: Colors.white,
    paddingHorizontal: rs(12),
    paddingVertical: rs(10),
    fontSize: rs(14),
    width: '100%',
  },

  darkInputFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
    elevation: 4,
  },

  // ── DROPDOWN / OVERFLOW MENU ──────────────────────────────────────────────

  dropdownItem: {
    paddingVertical: rs(10),
    paddingHorizontal: rs(16),
    fontSize: rs(14),
    color: '#131212',
  },

  dropdownItemHovered: {
    backgroundColor: Colors.cardBg,
    color: Colors.primary,
  },

});

export default S;