package com.hooppath.global.exception;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum P2ErrorCode {
    ROLE_REQUIRED     (HttpStatus.FORBIDDEN, "ROLE_REQUIRED",       "沅뚰븳??遺議깊빀?덈떎."),
    NOT_OWNER         (HttpStatus.FORBIDDEN, "NOT_OWNER",           "蹂몄씤 ?뚯쑀 由ъ냼?ㅺ? ?꾨떃?덈떎."),
    APPLICATION_PENDING(HttpStatus.CONFLICT, "APPLICATION_PENDING", "?대? ?ъ궗 以묒씤 ?좎껌???덉뒿?덈떎."),
    DELETE_BLOCKED    (HttpStatus.CONFLICT,  "DELETE_BLOCKED",      "?섍컯?앹씠 ?덉뼱 ??젣?????놁뒿?덈떎."),
    SELF_DEMOTION     (HttpStatus.CONFLICT,  "SELF_DEMOTION",       "蹂몄씤 沅뚰븳??吏곸젒 蹂寃쏀븷 ???놁뒿?덈떎."),
    ACCOUNT_SUSPENDED (HttpStatus.FORBIDDEN, "ACCOUNT_SUSPENDED",   "?뺤???怨꾩젙?낅땲??");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}