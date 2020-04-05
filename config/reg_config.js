exports.REG = {
    //太短
    NUM_SHORT:/^.{0,1}$/,
    //太长
    NUM_LONG:/^.{17,}/,
    //特殊字符包括-_
    NUM_SPEC:/^[\u4e00-\u9fa5_\-a-zA-Z0-9]+$/
}