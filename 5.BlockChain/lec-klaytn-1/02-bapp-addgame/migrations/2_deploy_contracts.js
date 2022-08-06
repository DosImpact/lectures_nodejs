const solidityFile = "./AdditionGame.sol"
const targetFile = artifacts.require(solidityFile);
const fs = require("fs");

module.exports = function (deployer) {
  deployer.deploy(targetFile).then(() => {
    if (targetFile._json) {
      // ABI - 블록체인과 컨트랙과 상호작용할 수 있는 파일
      // application binary interface
      // 상호작용할 수 있는 함수들과 변수들이 JSON형태로 제공
      fs.writeFile(
        "deployedABI",
        JSON.stringify(targetFile._json.abi),
        (err) => {
          if (err) throw err;
          console.log("> 파일에 ABI 입력 성공");
        }
      );
    }
    // 베포된 주소 정보를 파일에 저장
    fs.writeFile("deployedAddress", targetFile.address, (err) => {
      if (err) throw err;
      console.log("> 파일에 주소 입력 성공");
    });
  });
};
