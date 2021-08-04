import { getPosition, formatText } from "@/assets/js/utils";
export default {
  methods: {
    handleSelectUser(user) {
      const originalText = this.textContent;
      const queryInfo = this.queryInfo;
      const cursorPosition = getPosition(this.id);
      const username = user.nickname + " ";
      const newText =
        originalText.slice(0, queryInfo.startPosition) +
        username +
        originalText.slice(queryInfo.endPosition);
      this.textContent = newText;
      this.emitText();
      this.showSelectUser = false;
      this.$nextTick(() => {
        const textEl = document.getElementById(this.id);
        textEl.setSelectionRange(
          cursorPosition + username.length - queryInfo.keyWord.length,
          cursorPosition + username.length - queryInfo.keyWord.length
        );
        textEl.focus();
      });
    },
    handleQueryUser(e) {
      const endPosition = getPosition(this.id);
      const startPosition = this.queryInfo.startPosition;
      const keyWord = this.textContent.slice(startPosition, endPosition);
      this.queryInfo.endPosition = endPosition;
      console.log(e, e.data);
      if (endPosition < startPosition || (e.returnValue && e.data === " ")) {
        // if (endPosition < startPosition || keyWord.slice(-1) === " ") {
        this.showSelectUser = false;
        return;
      }

      this.queryInfo.keyWord = keyWord;
      this.$emit("queryUserList", keyWord);
    },
    // handleCallUser(e) {
    //   // console.log('aaa');
    //   // console.log(e);
    //   // alert(e.key)
      
      
    //   if (e.key === "@" || (e.key === "Process" && e.code === "Digit2")) {
    //     this.createSelectUserDialog();
    //   }
    // },
    createSelectUserDialog() {
      const textEl = document.getElementById(this.id);
      if (!textEl) return;
      const height = getComputedStyle(textEl).getPropertyValue("height");
      const width = getComputedStyle(textEl).getPropertyValue("width");
      const scrollTop = textEl.scrollTop;
      const originalText = this.textContent;
      const cursorPoint = getPosition(this.id);
      const selectionInfo = {
        selectionStart: cursorPoint,
        selectionEnd: cursorPoint
      };
      const newText = formatText(
        originalText,
        selectionInfo,
        "<span id='call_position'>",
        "</span>"
      );
      const hideEl = this.createHideEl("clac_position_El_");
      hideEl.style.position = "absolute";
      hideEl.style.width = width;
      hideEl.style.height = height;
      hideEl.style.overflowY = "auto";
      hideEl.style.wordBreak = "break-all";
      hideEl.style.top = "14px";
      hideEl.style.left = 0;
      hideEl.style.whiteSpace = "pre-wrap";
      hideEl.innerHTML = newText;
      this.$nextTick(() => {
        hideEl.scrollTop = scrollTop;
        const pEl = document.getElementById("call_position");
        const frameWidth = textEl.parentNode.offsetWidth;
        this.selectUserPosition = {
          left:
            pEl.offsetLeft < frameWidth * (2 / 3)
              ? pEl.offsetLeft
              : pEl.offsetLeft - 200,
          top: pEl.offsetTop - textEl.scrollTop
          // left: pEl.getBoundingClientRect().left,
          // top: pEl.getBoundingClientRect().top
        };
        textEl.parentNode.removeChild(hideEl);
        this.queryInfo.startPosition = getPosition(this.id) + 1;
        this.queryInfo.endPosition = getPosition(this.id) + 1;
        this.$emit("queryUserList", this.queryInfo.keyWord);
        this.$nextTick(() => {
          const userList = this.userList;
          if (userList === false) return;
          this.showSelectUser = true;
          this.$nextTick(() => {
            const list = textEl.parentNode.querySelector(".md_select_user");
            if (list) {
              this.activeUserIndex = 0;
              list.scrollTo(0, 0);
            }
          });
        });
      });
    },
    getUserByName(name) {
      const userList = this.userList;
      if (!userList.length) return "";
      return userList.find(item => item.nickname === name);
    }
  }
};
