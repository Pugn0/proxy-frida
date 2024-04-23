Java.perform(function() {
    var OkHttpClient = Java.use('okhttp3.OkHttpClient');
    var Request = Java.use('okhttp3.Request');
    var Interceptor = Java.use('okhttp3.Interceptor');

    var LoggingInterceptor = Java.registerClass({
        name: 'com.example.LoggingInterceptor',
        implements: [Interceptor],
        methods: {
            intercept: function(chain) {
                var request = chain.request();
                var url = request.url().toString();
                var method = request.method();
                var headers = request.headers().toString();

                // Formatação do log da chamada da API
                console.log("\n============================");
                console.log("[API Resquest]");
                console.log(method + " " + url);
                console.log(headers.replace(/,/g, '\n'));
                console.log("\n");

                var response = chain.proceed(request);

                // Formatação do log da resposta da API
                console.log("============================");
                console.log("[API Response] - [" + url + "]");
                console.log("Status: " + response.code());
                var responseBody = response.peekBody(1024 * 1024).string(); // Limita a leitura do corpo da resposta para evitar consumo excessivo de memória
                console.log("Body: " + responseBody);
                console.log("============================\n");

                return response;
            }
        }
    });

    OkHttpClient.newBuilder.implementation = function() {
        var builder = this.newBuilder();
        builder.interceptors().add(LoggingInterceptor.$new());
        return builder;
    };
});
