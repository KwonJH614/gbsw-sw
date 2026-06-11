# HoopPath P3 Troubleshooting

P3 운영형 확장을 구현하면서 실제로 발생한 오류와 해결 과정을 기록한다.

## 기록 형식

- 증상:
- 원인:
- 해결:
- 검증:

## 1. Gradle Wrapper 다운로드가 샌드박스에서 차단됨

- 증상: `.\gradlew.bat compileJava` 실행 시 Gradle 배포 파일 다운로드 과정에서 `java.net.SocketException: Permission denied`가 발생했다.
- 원인: 최초 Gradle Wrapper 실행에 외부 네트워크가 필요하지만 기본 샌드박스의 네트워크 접근이 제한되어 있었다.
- 해결: 승인된 외부 실행으로 동일한 컴파일 명령을 다시 실행해 Gradle 배포 파일과 의존성을 내려받았다.
- 검증: Gradle 컴파일 단계가 시작되어 실제 Java 컴파일 오류까지 진행되는 것을 확인했다.

## 2. Spring Boot 3.5에서 `RestClientBuilder` 타입을 찾지 못함

- 증상: `HttpClientConfig` 컴파일 시 `org.springframework.boot.web.client.RestClientBuilder`를 찾을 수 없다는 오류가 발생했다.
- 원인: 프로젝트가 사용하는 Spring Boot 3.5 의존성에는 해당 타입이 제공되지 않으며 Spring Framework의 `RestClient` 빌더를 사용해야 한다.
- 해결: 별도 `RestClientBuilder` 주입을 제거하고 `RestClient.builder()`로 요청 팩토리와 타임아웃을 설정했다.
- 검증: 수정 후 `.\gradlew.bat compileJava`가 성공했다.

## 3. PowerShell 출력의 한글 깨짐으로 프론트 패치 문맥이 일치하지 않음

- 증상: 관리자 레이아웃에 메뉴를 추가하는 패치가 기존 줄을 찾지 못해 적용되지 않았다.
- 원인: 기본 PowerShell 출력에서 UTF-8 한글이 깨져 보였고, 깨진 문자열을 패치 문맥으로 사용해 실제 파일 내용과 일치하지 않았다.
- 해결: `Get-Content -Encoding UTF8`로 실제 내용을 다시 확인하고 작은 패치 단위로 나누어 적용했다.
- 검증: 변경 파일이 정상 생성되었고 `npm.cmd run build`가 성공했다.

## 4. 현재 Spring Data 버전에서 `Specification.unrestricted()`를 사용할 수 없음

- 증상: 백엔드 테스트의 컴파일 단계에서 `Specification.unrestricted()` 메서드를 찾지 못했다.
- 원인: 해당 프로젝트가 해석한 Spring Data JPA API에는 `unrestricted()`가 제공되지 않았다.
- 해결: 항상 참인 초기 조건 `(root, query, cb) -> cb.conjunction()`을 사용하고 이후 검색 조건을 `and`로 결합했다.
- 검증: 수정 후 `.\gradlew.bat test`가 성공했다.

## 5. PowerShell 실행 정책이 `npm.ps1` 실행을 차단함

- 증상: `npm run build` 실행 시 `PSSecurityException`이 발생했다.
- 원인: Windows PowerShell 실행 정책이 Node.js의 `npm.ps1` 스크립트 실행을 허용하지 않았다.
- 해결: 동일한 npm CLI의 Windows 실행 파일인 `npm.cmd run build`를 사용했다.
- 검증: `npm.cmd run build`가 성공해 TypeScript 검사와 Vite 프로덕션 빌드를 완료했다.
