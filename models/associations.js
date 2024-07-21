const USER = require('./user');
const GROUP = require('./group');
const USER_GROUP = require('./usergroup');
const PAPER = require('./paper');
const LETTER = require('./letter');
const GUEST = require('./guest');

// USER-GROUP 관계
USER.hasMany(USER_GROUP, { foreignKey: 'user_no', as: 'USER_GROUP' });
USER_GROUP.belongsTo(USER, { foreignKey: 'user_no', as: 'USER' });

GROUP.hasMany(USER_GROUP, { foreignKey: 'group_no', as: 'USER_GROUP' });
USER_GROUP.belongsTo(GROUP, { foreignKey: 'group_no', as: 'GROUP' });

// GUEST 테이블이 다
USER.hasMany(GUEST, { foreignKey: 'user_no', as: 'GUEST' });
GUEST.belongsTo(USER, { foreignKey: 'user_no', as: 'USER' });

GROUP.hasMany(PAPER, { foreignKey: 'group_no', as: 'GUEST' });
GUEST.belongsTo(GROUP, { foreignKey: 'group_no', as: 'GROUP' });

// PAPER 테이블이 다
USER.hasMany(PAPER, { foreignKey: 'user_no', as: 'PAPER' });
PAPER.belongsTo(USER, { foreignKey: 'user_no', as: 'USER' });

GROUP.hasMany(PAPER, { foreignKey: 'group_no', as: 'PAPER' });
PAPER.belongsTo(GROUP, { foreignKey: 'group_no', as: 'GROUP' });

GUEST.hasMany(PAPER, { foreignKey: 'guest_no', as: 'PAPER' });
PAPER.belongsTo(GUEST, { foreignKey: 'guest_no', as: 'GUEST' });

// LETTER 테이블이 다
USER.hasMany(PAPER, { foreignKey: 'user_no', as: 'PAPER' });
PAPER.belongsTo(USER, { foreignKey: 'user_no', as: 'USER' });

PAPER.hasMany(LETTER, { foreignKey: 'paper_no', as: 'LETTER' });
LETTER.belongsTo(PAPER, { foreignKey: 'paper_no', as: 'PAPER' });

module.exports = {
    USER,
    GROUP,
    USER_GROUP,
    GUEST,
    PAPER,
    LETTER
};