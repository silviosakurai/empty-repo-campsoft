export enum HTTPStatusCode {
  // Informacional
  /** O servidor recebeu a solicitação inicial e o cliente deve continuar a enviar o resto da solicitação. */
  CONTINUE = 100,
  /** O servidor entende e está disposto a atender à solicitação do cliente para mudar os protocolos. */
  SWITCHING_PROTOCOLS = 101,
  /** O servidor recebeu e está processando a solicitação, mas ainda não há uma resposta disponível. */
  PROCESSING = 102,
  /** O servidor vai enviar dicas para o cliente sobre a pré-carga de recursos enquanto a resposta final ainda não está pronta. */
  EARLY_HINTS = 103,

  // Sucesso
  /** A solicitação foi bem-sucedida. */
  OK = 200,
  /** A solicitação foi bem-sucedida e um novo recurso foi criado como resultado. */
  CREATED = 201,
  /** A solicitação foi aceita para processamento, mas o processamento não foi concluído. */
  ACCEPTED = 202,
  /** A solicitação foi bem-sucedida, mas as informações retornadas podem vir de outra fonte. */
  NON_AUTHORITATIVE_INFORMATION = 203,
  /** A solicitação foi bem-sucedida, mas o cliente não precisa sair da página atual. */
  NO_CONTENT = 204,
  /** A solicitação foi bem-sucedida e o cliente deve redefinir a visualização que originou a solicitação. */
  RESET_CONTENT = 205,
  /** A solicitação serviu parcialmente o conteúdo solicitado. */
  PARTIAL_CONTENT = 206,
  /** Uma resposta multi-status que pode conter várias respostas independentes. */
  MULTI_STATUS = 207,

  // Redirecionamento
  /** Há múltiplas opções para o recurso que o cliente pode seguir. */
  MULTIPLE_CHOICES = 300,
  /** Este recurso foi movido permanentemente para uma nova URL. */
  MOVED_PERMANENTLY = 301,
  /** Este recurso foi movido temporariamente para uma nova URL. */
  MOVED_TEMPORARILY = 302,
  /** O cliente deve fazer uma solicitação GET para outra URL. */
  SEE_OTHER = 303,
  /** O recurso não foi modificado desde a última solicitação. */
  NOT_MODIFIED = 304,
  /** O recurso solicitado deve ser acessado por meio do proxy fornecido no cabeçalho da resposta. */
  USE_PROXY = 305,
  /** O recurso foi movido temporariamente para outra URL, mas futuras solicitações ainda devem usar a URL original. */
  TEMPORARY_REDIRECT = 307,
  /** O recurso foi movido permanentemente para outra URL, semelhante ao 301, mas reutiliza o método HTTP original. */
  PERMANENT_REDIRECT = 308,

  // Erro do Cliente
  /** A solicitação não pôde ser entendida pelo servidor devido à sintaxe malformada. */
  BAD_REQUEST = 400,
  /** A solicitação requer autenticação do usuário. */
  UNAUTHORIZED = 401,
  /** Reservado para uso futuro. A intenção original era que ele fosse usado para transações financeiras. */
  PAYMENT_REQUIRED = 402,
  /** O servidor entendeu a solicitação, mas se recusa a autorizá-la. */
  FORBIDDEN = 403,
  /** O servidor não encontrou nada que corresponda ao URI da solicitação. */
  NOT_FOUND = 404,
  /** O método solicitado é conhecido pelo servidor, mas foi desativado e não pode ser usado. */
  METHOD_NOT_ALLOWED = 405,
  /** O servidor não pode produzir uma resposta correspondente aos critérios enviados pelo agente do usuário. */
  NOT_ACCEPTABLE = 406,
  /** Semelhante ao 401, mas indica que o cliente deve primeiro se autenticar com o proxy. */
  PROXY_AUTHENTICATION_REQUIRED = 407,
  /** O servidor não conseguiu responder à solicitação dentro do tempo esperado pelo cliente. */
  REQUEST_TIMEOUT = 408,
  /** A solicitação não pôde ser concluída devido a um conflito com o estado atual do recurso. */
  CONFLICT = 409,
  /** O recurso solicitado foi removido permanentemente e não estará mais disponível. */
  GONE = 410,
  /** A solicitação não foi aceita porque falta um cabeçalho de comprimento de conteúdo válido. */
  LENGTH_REQUIRED = 411,
  /** O servidor não atende a uma das pré-condições que o solicitante colocou na solicitação. */
  PRECONDITION_FAILED = 412,
  /** A solicitação é maior do que os limites definidos pelo servidor; o servidor pode fechar a conexão ou devolver um Retry-After. */
  REQUEST_TOO_LONG = 413,
  /** O URI fornecido era muito longo para o servidor processar. */
  REQUEST_URI_TOO_LONG = 414,
  /** O formato de mídia dos dados solicitados não é suportado pelo servidor, portanto, o servidor rejeita a solicitação. */
  UNSUPPORTED_MEDIA_TYPE = 415,
  /** O intervalo especificado não pode ser satisfeito. */
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  /** A expectativa dada no cabeçalho da solicitação não pode ser cumprida pelo servidor. */
  EXPECTATION_FAILED = 417,
  /** O servidor recusa a tentativa de cozinhar café com uma chaleira. */
  IM_A_TEAPOT = 418,
  /** O servidor detectou que não há espaço suficiente para completar a solicitação. */
  INSUFFICIENT_SPACE_ON_RESOURCE = 419,
  /** Um método de solicitação não foi bem-sucedido devido a falhas anteriores. */
  METHOD_FAILURE = 420,
  /** A solicitação foi direcionada a um servidor que não é capaz de produzir uma resposta (por exemplo, porque uma conexão foi reutilizada). */
  MISDIRECTED_REQUEST = 421,
  /** A solicitação estava bem formada, mas não pôde ser seguida devido a erros semânticos. */
  UNPROCESSABLE_ENTITY = 422,
  /** O recurso que está sendo acessado está trancado. */
  LOCKED = 423,
  /** A solicitação falhou devido a uma falha na solicitação anterior. */
  FAILED_DEPENDENCY = 424,
  /** O cliente deve mudar para uma conexão diferente que é indicada no cabeçalho da resposta. */
  UPGRADE_REQUIRED = 426,
  /** O servidor requer que a solicitação do navegador seja condicional (geralmente como resultado de uma re-carga da página). */
  PRECONDITION_REQUIRED = 428,
  /** O usuário enviou muitas solicitações em um dado período de tempo. */
  TOO_MANY_REQUESTS = 429,
  /** O servidor não está disposto a processar a solicitação porque os campos de cabeçalho são muito grandes. */
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  /** O conteúdo foi removido como resultado de uma ordem legal. */
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  // Erro do Servidor
  /** O servidor encontrou uma situação com a qual não sabe lidar. */
  INTERNAL_SERVER_ERROR = 500,
  /** O servidor não suporta a funcionalidade necessária para cumprir a solicitação. */
  NOT_IMPLEMENTED = 501,
  /** O servidor agiu como um gateway ou proxy e recebeu uma resposta inválida do servidor upstream. */
  BAD_GATEWAY = 502,
  /** O servidor não está disponível no momento (sobrecarregado ou desligado para manutenção). Geralmente, esta é uma condição temporária. */
  SERVICE_UNAVAILABLE = 503,
  /** O servidor agiu como um gateway ou proxy e não recebeu uma resposta a tempo do servidor upstream. */
  GATEWAY_TIMEOUT = 504,
  /** A versão do HTTP usada na solicitação não é suportada pelo servidor. */
  HTTP_VERSION_NOT_SUPPORTED = 505,
  /** O servidor não tem espaço de armazenamento suficiente para completar a solicitação. */
  INSUFFICIENT_STORAGE = 507,
  /** O cliente precisa se autenticar para ganhar acesso à rede. */
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}
