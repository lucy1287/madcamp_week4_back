const USER = require('./user');
const GROUP = require('./group');
const USER_GROUP = require('./usergroup');
const PAPER = require('./paper');
const LETTER = require('./letter');
const GUEST = require('./guest');
const BACKGROUND = require('./background');

// USER-GROUP 관계
USER.hasMany(USER_GROUP, { foreignKey: 'user_no', as: 'userGroups' });
USER_GROUP.belongsTo(USER, { foreignKey: 'user_no', as: 'user' });

GROUP.hasMany(USER_GROUP, { foreignKey: 'group_no', as: 'groupUsers' });
USER_GROUP.belongsTo(GROUP, { foreignKey: 'group_no', as: 'group' });

// GUEST 관계
USER.hasMany(GUEST, { foreignKey: 'user_no', as: 'userGuests' });
GUEST.belongsTo(USER, { foreignKey: 'user_no', as: 'guestUser' });

GROUP.hasMany(GUEST, { foreignKey: 'group_no', as: 'groupGuests' });
GUEST.belongsTo(GROUP, { foreignKey: 'group_no', as: 'guestGroup' });

// PAPER 관계
USER.hasMany(PAPER, { foreignKey: 'user_no', as: 'userPapers' });
PAPER.belongsTo(USER, { foreignKey: 'user_no', as: 'paperUser' });

GROUP.hasMany(PAPER, { foreignKey: 'group_no', as: 'groupPapers' });
PAPER.belongsTo(GROUP, { foreignKey: 'group_no', as: 'paperGroup' });

GUEST.hasMany(PAPER, { foreignKey: 'guest_no', as: 'guestPapers' });
PAPER.belongsTo(GUEST, { foreignKey: 'guest_no', as: 'paperGuest' });

// LETTER 관계
USER.hasMany(LETTER, { foreignKey: 'user_no', as: 'userLetters' });
LETTER.belongsTo(USER, { foreignKey: 'user_no', as: 'letterUser' });

PAPER.hasMany(LETTER, { foreignKey: 'paper_no', as: 'paperLetters' });
LETTER.belongsTo(PAPER, { foreignKey: 'paper_no', as: 'letterPaper' });

BACKGROUND.hasMany(LETTER, { foreignKey: 'background_no', as: 'backgroundLetters' });
LETTER.belongsTo(BACKGROUND, { foreignKey: 'background_no', as: 'letterBackground' });

module.exports = {
    USER,
    GROUP,
    USER_GROUP,
    GUEST,
    PAPER,
    LETTER,
    BACKGROUND
};