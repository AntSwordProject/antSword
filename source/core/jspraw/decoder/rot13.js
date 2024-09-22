/**
 * jsp::rot13 解码器
 */

 'use strict';
 const rot13encode = (s) => {
   //use a Regular Expression to Replace only the characters that are a-z or A-Z
   return s.replace(/[a-zA-Z]/g, function (c) {
     // Get the character code of the current character and add 13 to it If it is
     // larger than z's character code then subtract 26 to support wrap around.
     return String.fromCharCode((c <= "Z" ?
         90 :
         122) >= (c = c.charCodeAt(0) + 13) ?
       c :
       c - 26);
   });
 };
 
 module.exports = {
   asoutput: () => {
     return `yv66vgAAADEAJgoACgAVBwAWCgACABcKAAIAGAoAAgAZCgACABoKAAIAGwkACQAcBwAdBwAeAQADcmVzAQASTGphdmEvbGFuZy9TdHJpbmc7AQAGPGluaXQ+AQAVKExqYXZhL2xhbmcvU3RyaW5nOylWAQAEQ29kZQEAD0xpbmVOdW1iZXJUYWJsZQEACHRvU3RyaW5nAQAUKClMamF2YS9sYW5nL1N0cmluZzsBAApTb3VyY2VGaWxlAQASQXNvdXRwdXRSb3QxMy5qYXZhDAANAB8BABZqYXZhL2xhbmcvU3RyaW5nQnVmZmVyDAANAA4MACAAIQwAIgAjDAAkACUMABEAEgwACwAMAQARc3JjL0Fzb3V0cHV0Um90MTMBABBqYXZhL2xhbmcvT2JqZWN0AQADKClWAQAGbGVuZ3RoAQADKClJAQAGY2hhckF0AQAEKEkpQwEACXNldENoYXJBdAEABShJQylWACEACQAKAAAAAQAAAAsADAAAAAIAAQANAA4AAQAPAAAA2QADAAUAAACVKrcAAbsAAlkrtwADTQM+HSy2AASiAHgsHbYABTYEFQQQYaEAFRUEEG2jAA4VBBANYJI2BKcASxUEEEGhABUVBBBNowAOFQQQDWCSNgSnADIVBBBuoQAVFQQQeqMADhUEEA1kkjYEpwAZFQQQTqEAEhUEEFqjAAsVBBANZJI2BCwdFQS2AAaEAwGn/4YqLLYAB7UACLEAAAABABAAAAAyAAwAAAAEAAQABQANAAYAFwAHAB4ACAA3AAkAUAAKAGkACwB/AAwAhgAGAIwADgCUAA8AAQARABIAAQAPAAAAHQABAAEAAAAFKrQACLAAAAABABAAAAAGAAEAAAASAAEAEwAAAAIAFA==`;
   },
   decode_buff: (buff) => {
     return Buffer.from(rot13encode(buff.toString()));
   }
 }